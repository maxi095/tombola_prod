import { Link } from "react-router-dom";
import '../assets/css/Home.css'; // Definiremos estilos para el home

function Home() {
    return (
        <div>

            {/* Hero Section */}
            <section className="hero">
                <h1>Gestión de Actividades Estudiantiles</h1>
                <p>Facilita la organización y seguimiento de las actividades académicas de los estudiantes.</p>
                <Link to="/login" className="btn btn-primary">Ingresá ahora</Link>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="feature">
                    <h2>Fácil Seguimiento de Actividades</h2>
                    <p>Accede fácilmente al registro de tus actividades y proyectos.</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <ul className="footer-links">
                    <li><Link to="/terms">Términos y condiciones</Link></li>
                    <li><Link to="/privacy">Política de privacidad</Link></li>
                    <li><Link to="/support">Soporte</Link></li>
                </ul>
                <div className="social-media">
                    <a href="https://facebook.com">Facebook</a>
                    <a href="https://twitter.com">Twitter</a>
                    <a href="https://instagram.com">Instagram</a>
                </div>
            </footer>
        </div>
    );
}

export default Home;
