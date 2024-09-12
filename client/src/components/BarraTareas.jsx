import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import '../assets/css/Navbar.css';

function BarraTareas() {
    const { isAuthenticated, logout, user } = useAuth();
    console.log(user)
    const [isMobile, setIsMobile] = useState(false);

    // Función para verificar el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Ajusta el tamaño aquí si es necesario
        };

        // Llama a la función una vez para inicializar el valor
        handleResize();

        // Agrega un event listener al resize
        window.addEventListener('resize', handleResize);

        // Limpia el event listener cuando el componente se desmonta
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <nav className="navbar">
            {/* Cambia dinámicamente el texto del título */}
            <h1 className="navbar-title">
                {isMobile ? "SIRAE - CSE" : "Sistema de Registro de Actividades Estudiantiles - CSE"}
            </h1>

            <ul className="navbar-links">
                {isAuthenticated ? (
                    <>
                        <li className="navbar-welcome">Hola {user.firstName}</li>
                        <li>
                            <Link 
                                to='/' 
                                onClick={logout} 
                                className="btn btn-danger"
                            >
                                Cerrar sesión
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link 
                                to='/login' 
                                className="btn"
                            >
                                Iniciar sesión
                            </Link>
                        </li>
                        {/*<li>
                            <Link 
                                to='/register' 
                                className="btn"
                            >
                                Registrarse
                            </Link>
                        </li>*/}
                    </>
                )}
            </ul>
        </nav>
    );
}

export default BarraTareas;
