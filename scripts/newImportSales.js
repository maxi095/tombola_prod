import mongoose from "mongoose";
import xlsx from "xlsx";
import "dotenv/config.js";

// Modelos
import Person from "../src/models/person.model.js";
import Client from "../src/models/client.model.js";
import Seller from "../src/models/seller.model.js";
import Sale from "../src/models/sale.model.js";
import BingoCard from "../src/models/bingoCard.model.js";
import Quota from "../src/models/quota.model.js";
import SellerPayment from "../src/models/sellerPayment.model.js";

// Configuración
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tomboladb";
const currentEditionId = "67fe9c0b3f7a9a72172e130c";
const defaultUserId = "67d055c1e43cd5cf99d4e407";


function getDueDate(baseDate, monthsToAdd) {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + monthsToAdd);
  date.setDate(10);
  return date;
}

async function importDataFromExcel(filePath) {
  const sellerTotals = new Map();
  const errors = [];
  let successCount = 0;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🟢 Conectado a MongoDB");

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    function extractNumbersFromRow(row) {
        const numbers = [];
        for (let i = 1; i <= 15; i++) {
          const colName = `N1_${i}`;
          const num = parseInt(row[colName], 10);
          if (!isNaN(num)) {
            numbers.push(num);
          }
        }
        return numbers;
      }

    for (const row of rows) {
      try {
        const dni = String(row["D.N.I"]).replace(/\./g, "").trim();
        const bingoCardNumber = row["Nro del Cartón"];
        const clientNumber = row["Cod del Comprador"];

        console.log(`🧾 Procesando DNI: ${dni} | Cartón: ${bingoCardNumber} | Cliente: ${clientNumber}`);

        // PERSON
        let person = await Person.findOne({ document: dni });
        if (!person) {
          const personData = {
            firstName: row["Apellido y Nombres"]?.split(" ").slice(1).join(" ") || "N/A",
            lastName: row["Apellido y Nombres"]?.split(" ")[0] || "N/A",
            document: dni,
            address: row["Domicilio"] || "",
            city: row["Localidad"] || "",
            phone: row["Teléfono"] || "",
          };
          const possibleEmail = row["Email"]?.trim();
          if (possibleEmail) personData.email = possibleEmail;
          person = await Person.create(personData);
        }

        // CLIENT
        let client = await Client.findOne({ person: person._id });
        if (!client) {
          const existingClientWithNumber = await Client.findOne({ clientNumber });
          if (existingClientWithNumber) {
            if (!existingClientWithNumber.person.equals(person._id)) {
              throw new Error(`Cliente ${clientNumber} ya existe y está vinculado a otra persona`);
            } else {
              client = existingClientWithNumber;
            }
          } else {
            client = await Client.create({ person: person._id, clientNumber, status: "Activo" });
          }
        }

        // SELLER
        const sellerName = row["Vendedor"]?.trim();
        const sellerNumber = row["Cod Vendedor"];
        let sellerPerson = await Person.findOne({ document: `seller-${sellerNumber}` });
        if (!sellerPerson) {
          sellerPerson = await Person.create({
            firstName: sellerName?.split(" ").slice(1).join(" ") || "N/A",
            lastName: sellerName?.split(" ")[0] || "N/A",
            document: `seller-${sellerNumber}`,
          });
        }

        let seller = await Seller.findOne({ person: sellerPerson._id });
        if (!seller) {
          seller = await Seller.create({
            code: sellerNumber,
            commissionRate: row["Porcentaje de comisión"] || 0,
            person: sellerPerson._id,
          });
        }

        // BINGO CARD
        let bingoCard = await BingoCard.findOne({ number: bingoCardNumber, edition: currentEditionId });
        let numbers = extractNumbersFromRow(row);  // Mover aquí la extracción de números
        if (!bingoCard) {
            bingoCard = await BingoCard.create({
              number: bingoCardNumber,
              seller: seller._id,
              edition: currentEditionId,
              status: "Vendido",
              user: defaultUserId,
              numbers
            });
        } else {
            bingoCard.status = "Vendido";
            bingoCard.user = defaultUserId;
            bingoCard.numbers = numbers;
            await bingoCard.save();
        }

        // SALE
        const sale = await Sale.create({
          client: client._id,
          seller: seller._id,
          bingoCard: bingoCard._id,
          edition: currentEditionId,
          status: "Pagado",
          saleDate: new Date("2024-10-01"),
          createdAt: new Date("2024-10-01"),
          user: defaultUserId,
        });

        // QUOTAS
        const cuotas = [];
        const today = new Date("2024-10-01");
        for (let i = 1; i <= 6; i++) {
          cuotas.push({ sale: sale._id, quotaNumber: i, dueDate: getDueDate(today, i - 1), amount: 8000, paymentDate: new Date("2024-10-01"), paymentMethod: "Efectivo" });
        }
        await Quota.insertMany(cuotas);

        // SUMAR AL VENDEDOR
        const ventaTotal = 8000 * 6;
        if (sellerTotals.has(seller._id.toString())) {
          sellerTotals.set(seller._id.toString(), sellerTotals.get(seller._id.toString()) + ventaTotal);
        } else {
          sellerTotals.set(seller._id.toString(), ventaTotal);
        }

        console.log(`✅ Venta y 8 cuotas creadas para cartón #${bingoCardNumber}`);
        successCount++;
      } catch (err) {
        errors.push({ cartón: row["Nro del Cartón"], dni: row["D.N.I"], cliente: row["Cod del Comprador"], error: err.message });
      }
    }

    // Crear SellerPayments por vendedor
// Crear SellerPayments por vendedor
for (const [sellerId, total] of sellerTotals.entries()) {
  // Obtener el porcentaje de comisión de cada vendedor desde la base de datos
  const seller = await Seller.findById(sellerId);  // Obtener el seller de la base de datos
  
  if (!seller) {
    console.error(`❌ Vendedor con ID ${sellerId} no encontrado`);
    continue;
  }

  const commissionRate = seller.commissionRate || 0;  // Usar el valor de comisión del vendedor

  await SellerPayment.create({
    edition: currentEditionId,
    seller: sellerId,
    createdBy: defaultUserId,
    reference: `Importación inicial ${new Date().toISOString().split("T")[0]}`,
    observations: "Importado desde Excel con ventas y cuotas",
    commissionAmount: commissionRate * total / 100,  // Cálculo correcto de la comisión
    checkAmount: 0,       // Valor predeterminado
    transferAmount: 0,    // Valor predeterminado
    tarjetaUnicaAmount: 0,    // Valor predeterminado
    cashAmount: total,     // Valor predeterminado
    date: new Date("2024-10-01")
  });
}

    // Mostrar resumen
    console.log("\n📊 RESUMEN FINAL:");
    console.log(`✅ Ventas exitosas: ${successCount}`);
    console.log(`❌ Errores: ${errors.length}`);
    console.table(errors);

    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error general:", err);
    await mongoose.disconnect();
  }
}

// Ejecutar
importDataFromExcel("./ventas.xlsx");
