import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
{/*import { useEffect} from "react";*/}
import { Link, useNavigate } from "react-router-dom";

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function RegisterPage() {

    const {
        register, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm()
    const {signup, isAuthenticated, errors: registerErrors } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate ('/tasks');
    }, [isAuthenticated]);

    {/*const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/users'); // Ajusta la URL si es necesario
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);
    */}

    useEffect(() => {
        if (isAuthenticated) navigate("/activities");
    }, [isAuthenticated])

    const onSubmit = handleSubmit(async (values) => {
            signup(values);
        });
    

    return (
        <div className="flex-center-container">
            <div className="inner-box">
            <h2 className="form-sub-title">Registrarse</h2>
                {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
                    <div className="form-error" key={i}>
                        {error}
                    </div>
                ))}

                <form onSubmit={onSubmit}>
                    
                    <input type = "text" {...register("username", {required: true})}
                        className="form-input"
                        placeholder="Usuario"/>
                        {errors.username && <p className = "form-error">Usuario es requerido</p>}
                    <input type = "email" {...register("email", {required: true})}
                        className="form-input"
                        placeholder="Email"/>
                        {errors.email && <p className = "form-error">Email es requerido</p>}
                    <input type = "password" {...register("password", {required: true})}
                        className="form-input"
                        placeholder="Contraseña"/>
                        {errors.password && <p className = "form-error">Contraseña es requerida</p>}
                    
                    {/*<select {...register("student", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2">
                        <option value="">Seleccione un usuario</option>
                        {users.map((user) => (
                            <option key={user._id} value={user.username}>
                                {user.username}
                            </option>
                        ))}
                    </select>*/}
                    
                    <button type = "submit"
                    className="button button--save">
                        Register
                    </button>
                </form>

                <p className="flex gap-x-2 justify-between">
                ¿Tenes una cuenta? <Link to="/login" className="text-gray-100"> Iniciar sesión </Link>
                </p>

            </div>
        </div>
    )
}

export default RegisterPage