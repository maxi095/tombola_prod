import { useEffect, useState } from "react";
import { useBingoCards } from "../../context/BingoCardContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

import { useEditionFilter } from "../../context/EditionFilterContext";

function BingoCardPage() {
  const { getBingoCardsWithSales, bingoCardsWithSales, deleteBingoCard } = useBingoCards();
  const { user } = useAuth();
  const { selectedEdition } = useEditionFilter();
  
  const [filters, setFilters] = useState({
    sellerAsignedName: "",
    sellerSaleName: "",
    number: "",
    status: "",
    sellerAssignedFilter: "",
    date: ""
  });

  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchBingoCards = async () => {
        try {
          await getBingoCardsWithSales();
        } catch (error) {
          console.error("Error fetching bingo cards with sales:", error);
        }
      };

      fetchBingoCards();
    }
  }, [getBingoCardsWithSales, user]);

  useEffect(() => {
    // Filtrar los cartones según los filtros seleccionados
    const applyFilters = () => {
      let filtered = bingoCardsWithSales;

      if (selectedEdition) {
        filtered = filtered.filter(card =>
          card.edition?._id === selectedEdition
        );
      }
      if (filters.sellerAsignedName) {
        filtered = filtered.filter(card => {
          const fullName = card.seller?.person
            ? `${card.seller.person.firstName} ${card.seller.person.lastName}`.toLowerCase()
            : "";
          return fullName.includes(filters.sellerAsignedName.toLowerCase());
        });
      }
  
      if (filters.sellerSaleName) {
        filtered = filtered.filter(card => {
          const fullName = card.sale?.seller
            ? `${card.sale.seller.firstName} ${card.sale.seller.lastName}`.toLowerCase()
            : "";
          return fullName.includes(filters.sellerSaleName.toLowerCase());
        });
      }
      if (filters.number) {
        filtered = filtered.filter(card =>
          card.number === parseInt(filters.number)  // Compara de forma exacta
        );
      }
      if (filters.status) {
        filtered = filtered.filter(card =>
          card.status.toLowerCase().includes(filters.status.toLowerCase())
        );
      }
      if (filters.sellerAssignedFilter === "assigned") {
        filtered = filtered.filter(card => !!card.seller);
      } else if (filters.sellerAssignedFilter === "unassigned") {
        filtered = filtered.filter(card => !card.seller);
      }
      if (filters.date) {
        filtered = filtered.filter(card => {
          const saleDate = card.sale?.saleDate;
          const formatted = dayjs.utc(saleDate).format("YYYY-MM-DD");
          console.log("Comparando:", formatted, "con", filters.date);
          return saleDate && formatted === filters.date;
        });
      }
      

      setFilteredCards(filtered);
    };

    applyFilters();
  }, [bingoCardsWithSales, filters, selectedEdition]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sellerAsignedName: "",
      sellerSaleName: "",
      number: "",
      status: "",
      sellerAssignedFilter: "",
      date: ""
    });
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Cartones de tómbola</h1>
      </div>

      {/* Filtros */}
      <div className="filters mb-2 flex flex-wrap items-end gap-2">
        <input
          className="form-input "
          type="text"
          name="sellerAsignedName"
          placeholder="Vendedor asignado"
          value={filters.sellerAsignedName}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="sellerSaleName"
          placeholder="Vendido por"
          value={filters.sellerSaleName}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="number"
          placeholder="N° de cartón"
          value={filters.number}
          onChange={handleFilterChange}
        />
        <select
          className="form-input mt-1 mb-3"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          <option value="Vendido">Vendido</option>
          <option value="Disponible">Disponible</option>
        </select>
        <select
          className="form-input mt-1 mb-3"
          name="sellerAssignedFilter"
          value={filters.sellerAssignedFilter}
          onChange={handleFilterChange}
        >
          <option value="">Todos</option>
          <option value="assigned">Asignados</option>
          <option value="unassigned">Sin asignar</option>
        </select>
        <input
          className="form-input"
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        
        {/* Botón para limpiar filtros */}
        <div className="flex-none">
          <button className="btn-primary mb-4 mt-2 mr-2 ml-2" onClick={handleClearFilters}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {(!filteredCards || filteredCards.length === 0) ? (
        <p className="empty-state">No hay cartones de bingo disponibles.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{filteredCards.length}</strong> cartones
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Edición</th>
                <th className="table-cell">N° cartón</th>
                <th className="table-cell">Estado</th>
                <th className="table-cell">Vendedor asignado</th>
                <th className="table-cell">Vendido por</th>
                <th className="table-cell">Cliente</th>
                <th className="table-cell">Fecha de Venta</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((card) => (
                <tr key={card._id} className="table-row">
                  <td className="table-cell">{card.edition?.name || "Sin edición"}</td>
                  <td className="table-cell">{card.number || "Sin número"}</td>
                  <td className="table-cell">{card.status || "Disponible"}</td>
                  <td className="table-cell">
                  {card.seller && card.seller.person 
                    ? `${card.seller.person.firstName} ${card.seller.person.lastName}` 
                    : "N/A"}
                  </td>
                  <td className="table-cell">
                    {card.sale?.seller
                      ? `${card.sale.seller.firstName} ${card.sale.seller.lastName}`
                      : "N/A"}
                  </td>
                  <td className="table-cell">
                    {card.sale?.client
                      ? `${card.sale.client.firstName} ${card.sale.client.lastName}`
                      : "N/A"}
                  </td>
                  <td className="table-cell">
                    {card.sale?.saleDate
                    ? dayjs.utc(card.sale.saleDate).format('DD/MM/YYYY')
                    : "N/A"}
                  </td>
                  <td className="table-cell">
                    {card.status !== "Disponible" && (
                      <div className="btn-group">
                        <Link
                          to={`/sale/view/${card.sale?._id}`}
                          className="btn-secondary mr-2 flex items-center gap-1"
                        >
                          Ver
                        </Link>
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

export default BingoCardPage;
