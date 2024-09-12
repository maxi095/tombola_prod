import { useForm } from "react-hook-form"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function LoginPage() {
  
  const {
    register, 
    handleSubmit, 
    formState: {errors},
  } = useForm();

  const {signin, errors: signinErrors, isAuthenticated, user} = useAuth();
  const navigate = useNavigate()

  const onSubmit = handleSubmit(data => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Redirige basado en el rol del usuario
      if (user?.roles === 'Estudiante') {
        navigate("/my-activities");
      } else {
        navigate("/activities");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex-center-container">
      <div className="inner-box">
      <h2 className="form-sub-title">Iniciar sesión</h2>
          {
              signinErrors.map((error, i ) => (
                  <div className="form-error" key={i}>
                      {error}
                  </div>
              ))
          }

        <form onSubmit={onSubmit}>
            <input type = "email" {...register("email", {required: true})}
                className="form-input"
                placeholder="Email"/>
                {errors.email && <p className = "form-error">Email es requerido</p>}
            <input type = "password" {...register("password", {required: true})}
                className="form-input"
                placeholder="Contraseña"/>
                {errors.password && <p className = "form-error">Contraseña es requerida</p>}
            
            <button type = "submit"
            className="button button--save">
                Ingresar
            </button>
        </form>

        {/*<p className="flex gap-x-2 justify-between">
            ¿No tienes una cuenta? <Link to="/register" className="text-gray-100"> Registrarse </Link>
        </p>*/}
      </div>
    </div>
  )
}

export default LoginPage