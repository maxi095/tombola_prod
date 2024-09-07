import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
{/*import { useEffect} from "react";*/}
import { Link, useNavigate } from "react-router-dom";

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
        <div className="flex h-[calc(100vh-100px)] items-center justify-center">
            
            <div className="bg-zinc-800 max-w-md p-10 rounded-md">
                {
                    registerErrors.map((error, i ) => (
                        <div className="bg-red-500 p-2 text-white my-2" key={i}>
                            {error}
                        </div>
                    ))
                }
                <h1 className="text-2xl font-bold my-2">Registrarse</h1>
                <form onSubmit={onSubmit}>
                    
                    <input type = "text" {...register("username", {required: true})}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Usuario"/>
                        {errors.username && <p className = "text-red-500">Usuario es requerido</p>}
                    <input type = "email" {...register("email", {required: true})}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Email"/>
                        {errors.email && <p className = "text-red-500">Email es requerido</p>}
                    <input type = "password" {...register("password", {required: true})}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Contraseña"/>
                        {errors.password && <p className = "text-red-500">Contraseña es requerida</p>}
                    
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
                    className="bg-sky-500 text-white px-4 py-2 rounded-md my-2">
                        Register
                    </button>
                </form>

                <p className="flex gap-x-2 justify-between">
                ¿Tenes una cuenta? <Link to="/login" className="text-sky-500"> Iniciar sesión </Link>
                </p>

            </div>
        </div>
    )
}

export default RegisterPage