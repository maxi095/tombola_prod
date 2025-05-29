import ReactModal from "react-modal";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

ReactModal.setAppElement("#root");

const FullPaymentModal = ({ 
  isOpen, 
  onClose, 
  quotas = [], 
  saleId, 
  bingoCardId, 
  onSave 
}) => {
  const [method, setMethod] = useState("Efectivo");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Campos específicos para tarjeta
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardPlan, setPlan] = useState("");
  const [authCode, setAuthNumber] = useState("");

  // Total de cuotas sumadas
  const totalAmount = quotas.reduce((sum, q) => sum + q.amount, 0);

  useEffect(() => {
    if (isOpen) {
      setMethod("Efectivo");
      setDate(dayjs().format("YYYY-MM-DD"));
      setCardHolder("");
      setCardNumber("");
      setPlan("");
      setAuthNumber("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Preparar payload
    const fullPaymentData = {
      saleId,
      bingoCardId,
      method,
      date,
      cardDetails: method === "Tarjeta"
        ? { cardHolder, cardNumber, cardPlan, cardAmount: totalAmount, authCode }
        : null,
    };
    onSave(fullPaymentData);
  };

  return (
<ReactModal
  isOpen={isOpen}
  onRequestClose={onClose}
  className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
  overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
>
  <div className="form-card">
    <h2 className="title">Pago de Contado</h2>

    <form onSubmit={handleSubmit} className="form-grid">
      {/* Método de Pago */}
      <div className="form-section">
        <label className="label">Método de Pago</label>
        <select
          className="form-input"
          value={method}
          onChange={e => setMethod(e.target.value)}
          required
        >
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Cheque">Cheque</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      {/* Fecha de Pago */}
      <div className="form-section">
        <label className="label">Fecha de Pago</label>
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      {/* Campos extra si es Tarjeta */}
      {method === "Tarjeta" && (
        <>
          <div className="form-section">
            <label className="label">Titular de Tarjeta</label>
            <input
              type="text"
              className="form-input"
              value={cardHolder}
              onChange={e => setCardHolder(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label className="label">Número de Tarjeta</label>
            <input
              type="text"
              className="form-input"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label className="label">Plan</label>
            <input
              type="text"
              className="form-input"
              value={cardPlan}
              onChange={e => setPlan(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <label className="label">Importe (Total cuotas)</label>
            <input
              type="text"
              className="form-input bg-gray-100 cursor-not-allowed"
              value={`$${totalAmount.toFixed(2)}`}
              readOnly
            />
          </div>

          <div className="form-section col-span-2">
            <label className="label">N° de Autorización</label>
            <input
              type="text"
              className="form-input"
              value={authCode}
              onChange={e => setAuthNumber(e.target.value)}
              required
            />
          </div>
        </>
      )}

      {/* Botones */}
      <div className="col-span-2 flex justify-end mt-4 space-x-2">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Confirmar Pago
        </button>
      </div>
    </form>
  </div>
</ReactModal>


  );
};

export default FullPaymentModal;
