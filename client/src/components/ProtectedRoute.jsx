import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // ✅ también traemos loading

  // Mientras carga el contexto (por ejemplo tras F5), no hacemos nada aún
  if (loading) return <div className="text-center mt-10">Cargando...</div>;

  // Verifica que el usuario esté autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica si el rol del usuario está dentro de los roles permitidos
  const userHasAllowedRole = allowedRoles.includes(user.roles);

  if (!userHasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si el rol es válido, renderiza el componente hijo (children)
  return children;
};

export default ProtectedRoute;
