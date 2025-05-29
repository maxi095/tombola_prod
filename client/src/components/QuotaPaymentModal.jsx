import ReactModal from "react-modal";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

ReactModal.setAppElement("#root");

const QuotaPaymentModal = ({ isOpen, onClose, quota, onSave }) => {
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [paymentDate, setPaymentDate] = useState(dayjs().format("YYYY-MM-DD"));

  useEffect(() => {
    if (quota) {
      setPaymentMethod(quota.paymentMethod || "Efectivo");
      setPaymentDate(quota.paymentDate || dayjs().format("YYYY-MM-DD"));
    }
  }, [quota, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...quota, paymentMethod, paymentDate });
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => {
        onClose();
      }}
      className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"

    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="form-card">
          <h2 className="title">
            {quota?.paymentDate ? "Anular Pago" : "Registrar Pago"}
          </h2>

          {quota ? (
            <form onSubmit={handleSubmit} className="form-grid">
              <div className="form-section col-span-2">
                <label className="label">Cuota nro:</label>
                <input
                  value={quota.quotaNumber}
                  disabled
                  className="form-input bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="form-section col-span-2">
                <label className="label">Monto</label>
                <input
                  value={`$${quota.amount}`}
                  disabled
                  className="form-input bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="form-section">
                <label className="label">Método de Pago</label>
                <select
                  className="form-input"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-section">
                <label className="label">Fecha de Pago</label>
                <input
                  type="date"
                  className="form-input"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>

              <div className="col-span-2 flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-500 mt-4">No hay datos disponibles</p>
          )}
        </div>
      </div>
    </ReactModal>
  );
};

export default QuotaPaymentModal;
