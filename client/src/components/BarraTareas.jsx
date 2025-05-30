// src/components/BarraTareas.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useEditionFilter } from "../context/EditionFilterContext";
import { useEditions } from "../context/EditionContext";

function BarraTareas() {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  const { selectedEdition, setSelectedEdition } = useEditionFilter();
  const { editions, getEditions } = useEditions();

  // 1) Detectar móvil / desktop
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 2) Cargar ediciones al iniciar sesión
  useEffect(() => {
    if (!isAuthenticated) return;
    getEditions();
  }, [isAuthenticated, getEditions]);

  // 3) Elegir la última edición *una sola vez* cuando llegan las ediciones
  useEffect(() => {
    if (!isAuthenticated) return;
    if (editions.length === 0) return;

    // selectedEdition puede venir como null o ""
    if (!selectedEdition) {
      const ultima = editions[editions.length - 1];
      setSelectedEdition(ultima._id);
    }
  }, [isAuthenticated, editions, selectedEdition, setSelectedEdition]);

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white z-50 flex items-center justify-between px-4 shadow">
      <h1 className="navbar-title ml-8">
        {isMobile ? "SGT" : "Sistema de gestión de tómbola"}
      </h1>

      <ul className="navbar-links flex items-center">
        {isAuthenticated ? (
          <>
            <li>
              <select
                className="text-sm px-4 py-1 rounded bg-gray-700 text-white border border-gray-600"
                value={selectedEdition || ""}
                onChange={(e) => setSelectedEdition(e.target.value || null)}
                disabled={editions.length === 0}
              >
                <option value="">Todas las ediciones</option>
                {editions.map((ed) => (
                  <option key={ed._id} value={ed._id}>
                    Edición {ed.name}
                  </option>
                ))}
              </select>
            </li>
            <li className="ml-4 mr-4 navbar-welcome">
              Hola {user.person?.firstName}
            </li>
            <li className="mr-4">
              <Link
                to="/"
                onClick={logout}
                className="btn btn-danger navbar-logout"
              >
                Cerrar sesión
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" className="btn">
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default BarraTareas;
