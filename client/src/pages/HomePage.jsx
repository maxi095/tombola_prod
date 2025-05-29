import { Link } from "react-router-dom";
import '../assets/css/Home.css';

function Home() {
    return (
        <div className="hero">
            <h1>Sistema de gestión de tómbola</h1>
            <Link to="/login" className="btn btn-primary">Iniciar ahora</Link>
        </div>
    );
}

export default Home;
