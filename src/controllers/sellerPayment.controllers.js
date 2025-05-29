import SellerPayment from '../models/sellerPayment.model.js';
import Seller from '../models/seller.model.js';
import Edition from '../models/edition.model.js';


// Crear nuevo pago de vendedor
export const createSellerPayment = async (req, res) => {
  console.log("REQ.BODY", req.body);
  console.log("USER", req.user);

  try {
    const {
      edition,
      seller,
      cashAmount = 0,
      transferAmount = 0,
      tarjetaUnicaAmount = 0,
      checks = [],
      // checkAmount = 0, ---> se calcula automáticamente desde el pre-save en el modelo
      commissionRate,
      commissionAmount,
      date,
      reference,
      observations
    } = req.body;

    // Buscar edición
    const editionData = await Edition.findById(edition);
    if (!editionData) {
        return res.status(404).json({ message: "Edición no encontrada" });
    }

    const createdBy = req.user?._id || req.user?.id;

    if (!seller) {
      return res.status(400).json({ message: "El campo 'seller' es obligatorio." });
    }

    // ✅ Calcular automáticamente el total de cheques
    // const checkAmount = checks.reduce((sum, check) => sum + Number(check.amount || 0), 0);

    //const totalAmount = Number(cashAmount) + Number(transferAmount) + Number(checkAmount);
    const totalAmount = Number(cashAmount) + Number(transferAmount) + Number(tarjetaUnicaAmount)

    if (totalAmount <= 0) {
      return res.status(400).json({
        message: "Debe ingresar al menos un monto mayor a cero (efectivo, cheque o transferencia)."
      });
    }

    const newPayment = new SellerPayment({
      edition,
      seller,
      cashAmount,
      transferAmount,
      tarjetaUnicaAmount,
      checks,
      //checkAmount,
      commissionRate,
      commissionAmount,
      date,
      reference,
      observations,
      createdBy
    });

    console.log("NEW PAYMENT", {
      edition,
      seller,
      cashAmount,
      transferAmount,
      tarjetaUnicaAmount,
      checks,
      //checkAmount,
      commissionRate,
      commissionAmount,
      date,
      reference,
      observations,
      createdBy
    });

    const savedPayment = await newPayment.save();

    const populatedPayment = await savedPayment.populate([
      { path: 'seller' },
      { path: 'createdBy' }
    ]);

    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).json({ message: "Error al registrar el pago", error });
  }
};


// Obtener todos los pagos
export const getSellerPayments = async (req, res) => {
  try {
    const payments = await SellerPayment.find()
      .sort({ sellerPaymentNumber: -1 }) // 1 = ascendente, -1 = descendente
      .populate(
        'edition'
      )
      .populate({
        path: 'seller',
        populate: { path: 'person' }
      })
      .populate({
        path: 'createdBy',
        populate: { path: 'person' }
      })
      .populate({
        path: 'canceledBy',
        populate: { path: 'person' }
      })
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener pagos por ID de vendedor
export const getSellerPaymentsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const payments = await SellerPayment.find({ seller: sellerId })
      .populate(
        'edition'
      )
      .populate({
        path: 'seller',
        populate: { path: 'person' }
      })
      .populate({
        path: 'createdBy',
        populate: { path: 'person' }
      })
      .populate({
        path: 'canceledBy',
        populate: { path: 'person' }
      })
      .sort({ date: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un pago
export const deleteSellerPayment = async (req, res) => {
  try {
    const payment = await SellerPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Pago no encontrado' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelSellerPayment = async (req, res) => {
  try {
    console.log("🛠 ID del pago a cancelar:", req.params.id);

    const payment = await SellerPayment.findById(req.params.id);

    if (!payment) {
      console.log("❌ Pago no encontrado");
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    console.log("✅ Pago encontrado:", payment);

    // Verificamos si ya está anulado
    if (payment.status === "Anulado") {
      return res.status(400).json({ message: "El pago ya está anulado" });
    }

    // Actualizamos el estado y la trazabilidad
    payment.status = "Anulado";
    payment.canceledBy = req.user?._id || req.user?.id;
    payment.canceledAt = new Date();

    const savedPayment = await payment.save();

    console.log("🔄 Pago anulado:", savedPayment);

    const updatedPayment = await SellerPayment.findById(savedPayment._id)
      .populate({
        path: 'seller',
        populate: { path: 'person' }
      })
      .populate('createdBy')
      .populate('canceledBy');

    res.json(updatedPayment);
  } catch (error) {
    console.error("❌ Error en cancelSellerPayment:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getSellerPaymentById = async (req, res) => {
  try {
    const payment = await SellerPayment.findById(req.params.id)
      .populate({
        path: 'seller',
        populate: { path: 'person' }
      })

    if (!payment) return res.status(404).json({ message: "Pago no encontrado" });

    res.json(payment);
  } catch (error) {
    console.error("Error al obtener pago:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

