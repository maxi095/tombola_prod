import { useEffect, useState } from "react";
import { useSales } from "../../context/SaleContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

import { useEditionFilter } from "../../context/EditionFilterContext";

function SaleTarjetaUnicaPage() {
  const { getSales, sales } = useSales();
  const { user } = useAuth();
  const { selectedEdition } = useEditionFilter();

  const [filters, setFilters] = useState({
    saleNumber: "",
    date: ""
  });
  const [filteredSales, setFilteredSales] = useState([]);

  // 1) Cargar todas las ventas al montar
  useEffect(() => {
    if (user) {
      getSales().catch(err => console.error("Error fetching sales:", err));
    }
  }, [getSales, user]);

  // 2) Aplicar filtros cada vez que cambien ventas o filtros
  useEffect(() => {
    let filtered = sales
      // Solo las pagadas con Tarjeta
      .filter(s => s.fullPaymentMethod === "Tarjeta");


    if (selectedEdition) {
      filtered = filtered.filter(s =>
        s.edition?._id === selectedEdition
      );
    }
    if (filters.saleNumber) {
      filtered = filtered.filter(s =>
        s.saleNumber?.toString().includes(filters.saleNumber)
      );
    }
    if (filters.date) {
      filtered = filtered.filter(s => {
        const formatted = dayjs(s.saleDate).format("YYYY-MM-DD");
        return formatted === filters.date;
      });
    }

    setFilteredSales(filtered);
  }, [sales, filters, selectedEdition]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  const handleClearFilters = () => {
    setFilters({ saleNumber: "", date: "" });
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Ventas con Tarjeta Única</h1>
      </div>

      {/* filtros */}
      <div className="filters mb-2">
        <input
          className="form-input min-w-[150px]"
          type="text"
          name="saleNumber"
          placeholder="N° de Venta"
          value={filters.saleNumber}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <button
          className="btn-primary mb-4 mt-2 mr-2 ml-2"
          onClick={e => { e.preventDefault(); handleClearFilters(); }}
        >
          Limpiar Filtros
        </button>
      </div>

      {filteredSales.length === 0 ? (
        <p className="empty-state">No hay ventas con Tarjeta Única registradas.</p>
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
                <th className="table-cell">N° Venta</th>
                <th className="table-cell">Edición</th>
                <th className="table-cell">N° Cartón</th>
                <th className="table-cell">Vendedor</th>
                <th className="table-cell">Cliente</th>
                <th className="table-cell">Fecha Venta</th>
                <th className="table-cell">Importe</th>
                <th className="table-cell">Titular Tarjeta</th>
                <th className="table-cell">N° Tarjeta</th>
                <th className="table-cell">Plan</th>
                <th className="table-cell">N° Autorización</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => {
                const d = sale.cardPaymentDetails || {};
                return (
                  <tr key={sale._id} className="table-row">
                    <td className="table-cell">{sale.saleNumber}</td>
                    <td className="table-cell">{sale.edition?.name}</td>
                    <td className="table-cell">{sale.bingoCard?.number}</td>
                    <td className="table-cell">
                      {sale.seller?.person?.firstName}{" "}
                      {sale.seller?.person?.lastName}
                    </td>
                    <td className="table-cell">
                      {sale.client?.person?.firstName}{" "}
                      {sale.client?.person?.lastName}
                    </td>
                    <td className="table-cell">
                      {dayjs(sale.saleDate).format("DD/MM/YYYY")}
                    </td>
                    <td className="table-cell">${d.cardAmount || "-"}</td>
                    <td className="table-cell">{d.cardHolder || "-"}</td>
                    <td className="table-cell">{d.cardNumber || "-"}</td>
                    <td className="table-cell">{d.cardPlan || "-"}</td>
                    <td className="table-cell">{d.authCode || "-"}</td>
                    <td className="table-cell">
                      <Link
                        to={`/sale/view/${sale._id}`}
                        className="btn-secondary flex items-center gap-1"
                      >
                      Ver
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default SaleTarjetaUnicaPage;
