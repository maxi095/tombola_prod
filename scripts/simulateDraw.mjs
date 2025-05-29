import mongoose from "mongoose";
import dotenv from "dotenv";
import readline from "readline";
import BingoCard from "../src/models/bingoCard.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/tomboladb";
const currentEditionId = "67f57274411a325cce729f1e";
const TOTAL_NUMEROS = 90;

async function sorteoManual() {
  await mongoose.connect(MONGODB_URI);
  console.log("🎱 Sorteo manual iniciado...");

  const cartones = await BingoCard.find({ edition: currentEditionId }, "_id numbers number");
  console.log(`🎫 Total de cartones cargados: ${cartones.length}`);

  const idToNumber = new Map();
  cartones.forEach(carton => {
    idToNumber.set(carton._id.toString(), carton.number);
  });

  const numerosSorteados = new Set();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function preguntarNumero() {
    rl.question(`\n🔢 Ingresá una bolilla (1-${TOTAL_NUMEROS}): `, (input) => {
      const numero = parseInt(input);
      if (isNaN(numero) || numero < 1 || numero > TOTAL_NUMEROS) {
        console.log("❌ Número inválido. Intentá de nuevo.");
        return preguntarNumero();
      }

      if (numerosSorteados.has(numero)) {
        console.log("⚠️ Ese número ya fue ingresado.");
        return preguntarNumero();
      }

      numerosSorteados.add(numero);
      console.log(`✅ Bolilla ${numero} registrada. Total sorteadas: ${numerosSorteados.size}`);

      // Mostrar todas las bolillas sorteadas en orden ascendente
      const bolillasOrdenadas = [...numerosSorteados].sort((a, b) => a - b);
      console.log(`📢 Bolillas extraídas hasta ahora: ${bolillasOrdenadas.join(", ")}`);

      // Verificar si hay ganador
      for (let carton of cartones) {
        if (carton.numbers.every(num => numerosSorteados.has(num))) {
          const numeroCarton = idToNumber.get(carton._id.toString());
          console.log(`🎉 ¡TENEMOS GANADOR! Cartón Nº ${numeroCarton}`);
          console.log(`🧮 Total de bolillas extraídas: ${numerosSorteados.size}`);
          rl.close();
        
          // Desconectamos después del cierre del readline
          mongoose.disconnect().then(() => {
            console.log("🔌 Conexión con MongoDB cerrada.");
            process.exit(0); // Finaliza el proceso correctamente
          });
        
          return;
        }
      }
      // Continuar pidiendo bolillas
      preguntarNumero();
    });
  }
  preguntarNumero();
}
// Ejecutar sorteo manual
sorteoManual();
