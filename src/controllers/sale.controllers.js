import Sale from '../models/sale.model.js';
import BingoCard from '../models/bingoCard.model.js';
import Quota from "../models/quota.model.js";
import Edition from "../models/edition.model.js";
import mongoose from 'mongoose';

// Obtener todas las ventas
export const getSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .sort({ saleNumber: -1 }) // 1 = ascendente, -1 = descendente
            .populate([
                { path: 'edition' },
                { path: 'bingoCard' },
                {
                    path: 'client',
                    populate: { path: 'person' } // 👈 anidado
                },
                {
                    path: 'seller',
                    populate: { path: 'person' } // 👈 anidado
                },
                { path: 'user' }
            ]);

        res.json(sales);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Obtener una venta por ID
export const getSale = async (req, res) => {
    try {
      const sale = await Sale.findById(req.params.id).populate([
        { path: 'edition' },
        { path: 'bingoCard' },
        {
          path: 'client',
          populate: { path: 'person' } // anidado
        },
        {
          path: 'seller',
          populate: { path: 'person' } // anidado
        },
        { path: 'user' }
      ])
      .sort({ createdAt: -1 }); // más recientes primero;
  
      if (!sale) return res.status(404).json({ message: 'Sale not found' });
      res.json(sale);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

// Crear una nueva venta y generar sus cuotas automáticamente
export const createSale = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en createSale:", req.body);

        const { edition, seller, client, bingoCard, saleDate, status } = req.body;

        // Validación básica
        if (!edition || !seller || !client || !bingoCard || !saleDate || !status) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Buscar edición
        const editionData = await Edition.findById(edition);
        if (!editionData) {
            return res.status(404).json({ message: "Edición no encontrada" });
        }

        const { installments } = editionData;
        if (!installments || !Array.isArray(installments) || installments.length === 0) {
            return res.status(400).json({ message: "La edición no tiene cuotas definidas" });
        }

        // Crear venta
        const newSale = new Sale({
            edition,
            seller,
            client,
            bingoCard,
            saleDate,
            status,
            user: req.user ? req.user.id : null,
        });

        const savedSale = await newSale.save();
        console.log("✅ Venta creada exitosamente:", savedSale);

        // Marcar cartón como vendido
        await BingoCard.findByIdAndUpdate(bingoCard, { status: "Vendido" });
        console.log(`🎟️ Cartón ${bingoCard} marcado como "Vendido"`);

        // Generar cuotas desde edición
        const quotas = installments.map((installment) => ({
            sale: savedSale._id,
            quotaNumber: installment.quotaNumber,
            dueDate: new Date(installment.dueDate),
            amount: parseFloat(installment.amount.toFixed(2)),
            paymentDate: null,
            paymentMethod: null,
        }));

        // Insertar cuotas
        const createdQuotas = await Quota.insertMany(quotas);
        console.log("✅ Cuotas generadas desde edición:", createdQuotas);

        res.json({ sale: savedSale, quotas: createdQuotas });

    } catch (error) {
        console.error("❌ Error en createSale:", error);
        res.status(500).json({ message: "Error al crear la venta y cuotas", error: error.message });
    }
};



// Editar una venta
export const updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(['edition', 'seller', 'bingoCard', 'client', 'user']);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });
        res.json(sale);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const cancelSale = async (req, res) => {
    try {
        console.log("🛠 ID de la venta a cancelar:", req.params.id);
        
        // Buscar la venta
        const sale = await Sale.findById(req.params.id);
        
        if (!sale) {
            console.log("❌ Venta no encontrada");
            return res.status(404).json({ message: 'Sale not found' });
        }

        console.log("✅ Venta encontrada:", sale);

        // Actualizar el estado de la venta a "Anulada"
        sale.status = "Anulada";
        const savedSale = await sale.save(); // Guarda los cambios

        console.log("🔄 Estado de la venta actualizado:", savedSale);

        // Verificar si la venta tiene un cartón de bingo asociado
        if (sale.bingoCard) {
            const updatedBingoCard = await BingoCard.findByIdAndUpdate(
                sale.bingoCard, 
                { status: "Disponible" },
                { new: true } 
            );
            console.log("🎟 Estado del cartón de bingo actualizado:", updatedBingoCard);
        } else {
            console.log("⚠ La venta no tiene un cartón de bingo asociado");
        }

        // Obtener la venta actualizada con los datos poblados
        const updatedSale = await Sale.findById(req.params.id).populate(['edition', 'seller', 'bingoCard', 'client', 'user']);

        res.json(updatedSale);
    } catch (error) {
        console.error("❌ Error en cancelSale:", error.message);
        return res.status(500).json({ message: error.message });
    }
};


// Eliminar una venta
export const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndDelete(req.params.id);
        if (!sale) return res.status(404).json({ message: 'Sale not found' });

        res.status(204).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener ventas por vendedor
export const getSalesBySeller = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const sales = await Sale.find({ seller: sellerId }).populate([
            { path: 'edition' },
            { path: 'bingoCard' },
            {
                path: 'client',
                populate: { path: 'person' }
            },
            {
                path: 'seller',
                populate: { path: 'person' }
            },
            { path: 'user' }
        ]);

        res.json(sales);
    } catch (error) {
        console.error("❌ Error en getSalesBySeller:", error.message);
        res.status(500).json({ message: error.message });
    }
};
