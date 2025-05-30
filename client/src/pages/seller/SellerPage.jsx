import { useEffect, useState } from "react";
import { useSellers } from "../../context/SellerContext"; 
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function SellerPage() {
  const { getSellers, sellers, deleteSeller } = useSellers();
  const { user } = useAuth(); 

  const [filters, setFilters] = useState({
    sellerNumber: "",
    sellerName: "",
    document: "",
    city: ""
  });

  const [filteredSellers, setFilteredSellers] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchSellers = async () => {
        try {
          await getSellers();
        } catch (error) {
          console.error("Error fetching sellers:", error);
        }
      };
      fetchSellers();
    }
  }, [user, getSellers]);

  useEffect(() => {
    let filtered = sellers;

    if (filters.sellerNumber) {
      filtered = filtered.filter(seller =>
        String(seller.sellerNumber).includes(filters.sellerNumber)
      );
    }
    if (filters.sellerName) {
      // Función para normalizar: quita tildes y pasa a minúsculas
      const normalizeText = (text) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      // Palabras a buscar, ya normalizadas
      const terms = normalizeText(filters.sellerName).split(/\s+/);

      filtered = filtered.filter(seller => {
        if (!seller?.person) return false;

        // Nombre completo normalizado
        const fullName = normalizeText(`${seller.person.firstName} ${seller.person.lastName}`);

        // Verifica que todas las palabras del filtro estén en el nombre completo
        return terms.every(term => fullName.includes(term));
      });
    }
    if (filters.document) {
      filtered = filtered.filter(seller =>
        String(seller.person?.document).includes(filters.document)
      );
    }
    if (filters.city) {
      filtered = filtered.filter(seller =>
        seller.person?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredSellers(filtered);
  }, [sellers, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      sellerNumber: "",
      sellerName: "",
      document: "",
      city: ""
    });
  };


  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Vendedores</h1>
        <Link to="/seller/new" className="btn-primary">
          Crear vendedor
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters mb-2">
        <input
          className="form-input"
          type="text"
          name="sellerNumber"
          placeholder="N° vendedor"
          value={filters.sellerNumber}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="sellerName"
          placeholder="Nombre vendedor"
          value={filters.sellerName}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="document"
          placeholder="N° documento"
          value={filters.document}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="city"
          placeholder="Localidad"
          value={filters.city}
          onChange={handleFilterChange}
        />

        <button className="btn-primary mb-4 mt-2 ml-2" onClick={handleClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      {!filteredSellers || filteredSellers.length === 0 ? (
        <p className="empty-state">No hay vendedores registrados.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{filteredSellers.length}</strong> vendedores
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">N° vendedor</th>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Apellido</th>
                <th className="table-cell">N° documento</th>
                <th className="table-cell">Teléfono</th>
                <th className="table-cell">Comisión</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSellers.map((seller) => (
                <tr key={seller._id} className="table-row">
                  <td className="table-cell">{seller.sellerNumber}</td>
                  <td className="table-cell">{seller.person?.firstName}</td>
                  <td className="table-cell">{seller.person?.lastName}</td>
                  <td className="table-cell">{seller.person?.document}</td>
                  <td className="table-cell">{seller.person?.phone}</td>
                  <td className="table-cell">{seller.commissionRate}%</td>
                  <td className="table-cell">
                    <div className="btn-group">
                      <Link to={`/seller/view/${seller._id}`} className="btn-secondary mr-2 flex items-center gap-1">
                        Ver
                      </Link>
                      <Link to={`/seller/edit/${seller._id}`} className="btn-secondary mr-2">
                        Editar
                      </Link>
                    </div>
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

export default SellerPage;
