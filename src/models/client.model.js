import mongoose from "mongoose";
import Counter from "./counter.model.js";

const clientSchema = new mongoose.Schema({
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
    unique: true
  },
  clientNumber: {
    type: Number,
    unique: true
  },
  notes: { type: String },
  status: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' }
}, {
  timestamps: true
});

// Hook pre-save para generar clientNumber automáticamente
clientSchema.pre("save", async function (next) {
  const client = this;

  if (client.isNew && !client.clientNumber) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { model: "Client" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      client.clientNumber = counter.seq.toString().padStart(0, "0"); // Ej: 0001
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('Client', clientSchema);
