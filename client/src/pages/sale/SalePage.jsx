import { useEffect, useState } from "react";
import { useSales } from "../../context/SaleContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaTimes } from "react-icons/fa";
import dayjs from "dayjs";

import { useEditionFilter } from "../../context/EditionFilterContext";

function SalePage() {
  const { getSales, sales, cancelSale } = useSales();
  const { user } = useAuth();
  const { selectedEdition } = useEditionFilter();

  const [filters, setFilters] = useState({
    saleNumber: "",
    status: "",
    date: ""
  });

  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchSales = async () => {
        try {
          await getSales();
        } catch (error) {
          console.error("Error fetching sales:", error);
        }
      };
      fetchSales();
    }
  }, [getSales, user]);

  useEffect(() => {
    let temp = sales;

    // ② Filtro global de edición
    if (selectedEdition) {
      temp = temp.filter(sale =>
        sale.edition?._id === selectedEdition
      );
    }

    // ③ Filtros locales
    if (filters.saleNumber) {
      temp = temp.filter(sale =>
        sale.saleNumber?.toString().includes(filters.saleNumber)
      );
    }

    if (filters.status === "") {
      temp = temp.filter(sale =>
        sale.status === "Pagado" || sale.status === "Pendiente de pago"
      );
    } else {
      temp = temp.filter(sale =>
        sale.status === filters.status
      );
    }

    if (filters.date) {
      temp = temp.filter(sale => {
        const formatted = dayjs.utc(sale.saleDate).format("YYYY-MM-DD");
        return formatted === filters.date;
      });
    }

    setFilteredSales(temp);
  }, [sales, filters, selectedEdition]); 

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      saleNumber: "",
      status: "",
      date: ""
    });
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("¿Estás seguro de que deseas anular esta venta?");
    if (confirmCancel) {
      try {
        await cancelSale(id);
        await getSales();
      } catch (error) {
        console.error("Error cancelando la venta:", error);
      }
    }
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Ventas</h1>
        <Link to="/sale/new" className="btn-primary">
          Crear venta
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters mb-4 mt-2 mr-2 ml-2">
        <input
          className="form-input"
          type="text"
          name="saleNumber"
          placeholder="Filtrar por número de venta"
          value={filters.saleNumber}
          onChange={handleFilterChange}
        />
        <select
          className="form-input mt-1 mb-3"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          <option value="Pagado">Pagado</option>
          <option value="Pendiente de pago">Pendiente de pago</option>
          <option value="Anulada">Anulada</option>
        </select>
        <input
          className="form-input"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        
        <button className="btn-primary mb-4 mt-2 mr-2 ml-2" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {(!filteredSales || filteredSales.length === 0) ? (
        <p className="empty-state">No hay ventas registradas.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{filteredSales.length}</strong> ventas
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Número de Venta</th>
                <th className="table-cell">Edición</th>
                <th className="table-cell">N° cartón</th>
                <th className="table-cell">Vendedor</th>
                <th className="table-cell">Cliente</th>
                <th className="table-cell">Estado</th>
                <th className="table-cell">Fecha de Venta</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="table-row">
                  <td className="table-cell">{sale.saleNumber || "Sin número"}</td>
                  <td className="table-cell">{sale.edition?.name || "Sin edición"}</td>
                  <td className="table-cell">{sale.bingoCard?.number || "Sin cartón"}</td>
                  <td className="table-cell">
                    {sale.seller?.person?.firstName || "Sin"} {sale.seller?.person?.lastName || ""}
                  </td>
                  <td className="table-cell">
                    {sale.client?.person?.firstName || "Sin"} {sale.client?.person?.lastName || ""}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`status-label ${
                        sale.status === "Anulada" ? "status-anulada" : 
                        sale.status === "Pendiente de pago" ? "status-pendiente" : "status-confirmada"
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    {dayjs.utc(sale.saleDate).format('DD/MM/YYYY') || "N/A"}
                  </td>
                  <td className="table-cell">
                    {sale.status !== "Anulada" && (
                      <div className="btn-group">
                        <Link
                          to={`/sale/view/${sale._id}`}
                          className="btn-secondary mr-2 flex items-center gap-1"
                        >
                          <FaEye /> Ver
                        </Link>
                        <button
                          onClick={() => handleCancel(sale._id)}
                          className="btn-cancel flex items-center gap-1"
                        >
                          <FaTimes /> Anular
                        </button>
                      </div>
                    )}
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

export default SalePage;
