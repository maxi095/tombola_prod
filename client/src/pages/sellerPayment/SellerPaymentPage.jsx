import { useEffect, useRef, useState } from "react";
import { useSellerPayments } from "../../context/SellerPaymentContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import SellerPaymentReceipt from "../../components/SellerPaymentReceipt";
import ReactDOMServer from "react-dom/server";

import { useEditionFilter } from "../../context/EditionFilterContext";

function SellerPaymentPage() {
  const {
    sellerPayments,
    getSellerPayments,
    cancelSellerPayment,
  } = useSellerPayments();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const printRef = useRef();
  const { selectedEdition } = useEditionFilter();


  const [filters, setFilters] = useState({
    payNumber: "",   
    sellerName: "",
    status: "",
    date: ""
  });

  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    // Llamada inicial para obtener los pagos
    getSellerPayments();
  }, []);

  useEffect(() => {
    // Aplicar los filtros siempre que los pagos o los filtros cambien
    const applyFilters = () => {
      let filtered = sellerPayments;

      if (selectedEdition) {
        filtered = filtered.filter(pay =>
          pay.edition?._id === selectedEdition
        );
      }

      if (filters.payNumber) {
        filtered = filtered.filter(pay =>
          pay.sellerPaymentNumber === parseInt(filters.payNumber)
        );
      }

      if (filters.sellerName) {
        // Función para normalizar: quita tildes y pasa a minúsculas
        const normalizeText = (text) => 
          text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        // Palabras a buscar, ya normalizadas
        const terms = normalizeText(filters.sellerName).split(/\s+/);

        filtered = filtered.filter(pay => {
          if (!pay?.seller?.person) return false;

          // Nombre completo normalizado
          const fullName = normalizeText(`${pay.seller.person.firstName} ${pay.seller.person.lastName}`);

          // Verifica que todas las palabras del filtro estén en el nombre completo
          return terms.every(term => fullName.includes(term));
        });
      }
      if (filters.status) {
        filtered = filtered.filter(pay =>
          pay.status.toLowerCase().includes(filters.status.toLowerCase())
        );
      }
      if (filters.date) {
        filtered = filtered.filter(pay =>
          dayjs(pay.date).format("YYYY-MM-DD") === filters.date
        );
      }

      setFilteredPayments(filtered);
    };

    applyFilters();
  }, [sellerPayments, filters, selectedEdition]); // Ahora depende de sellerPayments también

  const handleCancel = async (id) => {
    const confirm = window.confirm("¿Estás seguro de anular este pago?");
    if (confirm) {
      try {
        await cancelSellerPayment(id);
        await getSellerPayments(); // Obtener los pagos nuevamente después de la cancelación
      } catch (error) {
        console.error("Error al anular el pago:", error);
      }
    }
  };

  const handleDownloadReceipt = async (payment) => {
  const html2pdf = (await import("html2pdf.js")).default;

  const htmlString = ReactDOMServer.renderToString(
    <SellerPaymentReceipt payment={payment}/>
  );

  const opt = {
    margin:       0.5,
    filename:     `Recibo_Pago_${payment.sellerPaymentNumber || "sin-numero"}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(htmlString).set(opt).save();
};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      payNumber: "",   
      sellerName: "",
      status: "",
      date: ""
    });
  };

  const getAmount = (payment) => 
  (payment.cashAmount || 0) +
  (payment.transferAmount || 0) +
  (payment.tarjetaUnicaAmount || 0) +
  (payment.checkAmount || 0);

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Pagos a vendedores</h1>
        <Link to="/sellerPayment/new" className="btn-primary">
          Registrar pago
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters mb-2">
        <input
          className="form-input"
          type="text"
          name="payNumber"
          placeholder="N° de pago"
          value={filters.payNumber}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="sellerName"
          placeholder="Vendedor"
          value={filters.sellerName}
          onChange={handleFilterChange}
        />
        <select
          className="form-input mt-1 mb-3"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          <option value="Activo">Activo</option>
          <option value="Anulado">Anulado</option>
        </select>
        <input
          className="form-input"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <button className="btn-primary mb-4 mt-2 mr-2 ml-2 " onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {!filteredPayments || filteredPayments.length === 0 ? (
        <p className="empty-state">No hay pagos registrados.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{filteredPayments.length}</strong> pagos a vendedores
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">N° pago</th>
                <th className="table-cell">Edición</th>
                <th className="table-cell">Vendedor</th>
                <th className="table-cell">Subtotal</th>
                <th className="table-cell">Comisión</th>
                <th className="table-cell">Total</th>
                <th className="table-cell">Fecha de pago</th>
                <th className="table-cell">Estado</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="table-row">
                  <td className="table-cell">{payment.sellerPaymentNumber || "-"}</td>
                  <td className="table-cell">{payment?.edition?.name ?? "Sin edición"}</td>
                  <td className="table-cell">{payment.seller?.person?.lastName},{" "}{payment.seller?.person?.firstName}</td>
                  <td className="table-cell">${getAmount(payment).toFixed(2)}</td>
                  <td className="table-cell">${(payment.commissionAmount ?? 0).toFixed(2)}</td>
                  <td className="table-cell"> ${(getAmount(payment) - (payment.commissionAmount || 0)).toFixed(2)}</td>
                  <td className="table-cell">{dayjs(payment.date).format("DD/MM/YYYY")}</td>
                  <td className="table-cell">
                    {payment.status === "Anulado" ? (
                      <span className="text-red-600 font-semibold">
                        Anulado
                        <br />
                        <span className="text-xs">
                          por {payment.canceledBy?.person?.firstName} {payment.canceledBy?.person?.lastName} el{" "}
                          {dayjs(payment.canceledAt).format("DD/MM/YYYY")}
                        </span>
                      </span>
                    ) : (
                      "Activo"
                    )}
                  </td>
                  <td className="table-cell">
                    <button onClick={() => handleDownloadReceipt(payment)} className="text-blue-600 underline mr-2">Descargar recibo</button>
                    {payment.status === "Activo" ? (
                      <button onClick={() => handleCancel(payment._id)} className="btn-cancel flex items-center gap-1">
                      Anular
                      </button>
                    ) : <span className="text-gray-400 text-sm"></span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default SellerPaymentPage;
