import { useEffect, useState } from "react";
import { useClients } from "../../context/ClientContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ClientPage() {
  const { getClients, clients } = useClients();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    clientNumber: "",
    clientName: "",
    document: "",
    city: ""
  });

  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchClients = async () => {
        try {
          await getClients();
        } catch (error) {
          console.error("Error fetching clients:", error);
        }
      };
      fetchClients();
    }
  }, [user]);

  useEffect(() => {
    let filtered = clients;

    if (filters.clientNumber) {
      filtered = filtered.filter(client =>
        String(client.clientNumber).includes(filters.clientNumber)
      );
    }
    if (filters.clientName) {
      // Función para normalizar: quita tildes y pasa a minúsculas
      const normalizeText = (text) => 
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      // Palabras a buscar, ya normalizadas
      const terms = normalizeText(filters.clientName).split(/\s+/);

      filtered = filtered.filter(client => {
        if (!client?.person) return false;

        // Nombre completo normalizado
        const fullName = normalizeText(`${client.person.firstName} ${client.person.lastName}`);

        // Verifica que todas las palabras del filtro estén en el nombre completo
        return terms.every(term => fullName.includes(term));
      });
    }
    if (filters.document) {
      filtered = filtered.filter(client =>
        String(client.person?.document).includes(filters.document)
      );
    }
    if (filters.city) {
      filtered = filtered.filter(client =>
        client.person?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    setFilteredClients(filtered);
  }, [clients, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      clientNumber: "",
      clientName: "",
      document: "",
      city: ""
    });
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Asociados</h1>
        <Link to="/client/new" className="btn-primary">
          Crear asociado
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters mb-2">
        <input
          className="form-input"
          type="text"
          name="clientNumber"
          placeholder="N° asociado"
          value={filters.clientNumber}
          onChange={handleFilterChange}
        />
        <input
          className="form-input"
          type="text"
          name="clientName"
          placeholder="Nombre asociado"
          value={filters.clientName}
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

      {!filteredClients || filteredClients.length === 0 ? (
        <p className="empty-state">No hay asociados registrados.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{filteredClients.length}</strong> asociados
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">N° asociado</th>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Apellido</th>
                <th className="table-cell">N° documento</th>
                <th className="table-cell">Dirección</th>
                <th className="table-cell">Localidad</th>
                <th className="table-cell">Teléfono</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client._id} className="table-row">
                  <td className="table-cell">{client.clientNumber}</td>
                  <td className="table-cell">{client.person?.firstName}</td>
                  <td className="table-cell">{client.person?.lastName}</td>
                  <td className="table-cell">{client.person?.document}</td>
                  <td className="table-cell">{client.person?.address}</td>
                  <td className="table-cell">{client.person?.city}</td>
                  <td className="table-cell">{client.person?.phone}</td>
                  <td className="table-cell">
                    <div className="btn-group">
                      <Link to={`/client/edit/${client._id}`} className="btn-secondary mr-2">
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

export default ClientPage;
