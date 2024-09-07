export const checkRole = (requiredRoles) => {
    return (req, res, next) => {
        const user = req.user; // Asegúrate de que el usuario esté en req.user

        if (!user || !user.roles) {
            return res.status(403).json({ message: "Access denied. No roles provided." });
        }

        if (!Array.isArray(requiredRoles)) {
            requiredRoles = [requiredRoles]; // Asegúrate de que requiredRoles sea un array
        }

        // Verifica si el usuario tiene al menos uno de los roles requeridos
        console.log("Roles autorizados: ", requiredRoles);
        console.log("Rol del usuario: ", user.roles);

        const hasRole = requiredRoles.some(role => user.roles === role);

        if (!hasRole) {
            return res.status(403).json({ message: "Access denied. You do not have the required role." });
        }

        next(); // Continúa con la siguiente función middleware
    };
};
