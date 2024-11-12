import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import '../assets/css/Global.css'; // Asegúrate de importar el CSS global
import logo from '../assets/images/logo_unc.png';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Logo del Sistema" className="sidebar-logo" />
      </div>

      <nav className="sidebar-nav">
        <Link to="/profile" className="sidebar-link">
          Perfil
        </Link>

        {/* Enlaces visibles solo para Administrador */}
        {user.roles === 'Administrador' && (
          <>
            <Link to="/users" className="sidebar-link">
              Usuarios
            </Link>
            <Link to="/academic-units" className="sidebar-link">
              Unidades académicas
            </Link>
          </>
        )}

        {/* Enlaces visibles para Administrador, Director, y Secretario */}
        {['Administrador', 'Secretario', 'Director'].includes(user.roles) && (
          <>
            <Link to="/directors" className="sidebar-link">
              Directores
            </Link>
            <Link to="/students" className="sidebar-link">
              Estudiantes
            </Link>
            <Link to="/projects" className="sidebar-link">
              Proyectos
            </Link>
            <Link to="/activity-projects" className="sidebar-link">
              Actividades de proyectos
            </Link>
            <Link to="/activities" className="sidebar-link">
              Actividades de estudiantes
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
