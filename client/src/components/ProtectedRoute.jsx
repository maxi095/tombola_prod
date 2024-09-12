import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); // Obtener el usuario desde el contexto

  // Verifica que el usuario esté autenticado
  if (!user) {
    //console.log("Usuario no autenticado. Redirigiendo a login.");
    return <Navigate to="/login" replace />;
  }

  //console.log("Rol del usuario (tipo y valor):", typeof user.roles, user.roles); 
  //console.log("Roles permitidos (tipo y valor):", typeof allowedRoles, allowedRoles);

  // Verifica si el rol del usuario está dentro de los roles permitidos
  const userHasAllowedRole = allowedRoles.includes(user.roles);

  //console.log("¿Usuario tiene rol permitido?", userHasAllowedRole);

  if (!userHasAllowedRole) {
    //console.log("Redirigiendo a la página de 'no autorizado'");
    return <Navigate to="/unauthorized" replace />;
  }

  // Si el rol es válido, renderiza el componente hijo (children)
  return children;
};

export default ProtectedRoute;
