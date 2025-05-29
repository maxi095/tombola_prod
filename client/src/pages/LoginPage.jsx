import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signin, errors: signinErrors, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.roles === "Administrador") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="main-content-full">
    <div className="page-wrapper justify-center min-h-screen mt-32">
      <div className="form-card">
        <h2 className="title">Iniciar sesión</h2>

        {signinErrors.map((error, i) => (
          <div key={i} className="form-error">
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-section">
            <label htmlFor="email" className="label">Correo electrónico</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="form-input"
              placeholder="Email"
              autoFocus
            />
            {errors.email && (
              <p className="form-error">Email es requerido</p>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="password" className="label">Contraseña</label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="form-input"
              placeholder="Contraseña"
            />
            {errors.password && (
              <p className="form-error">Contraseña es requerida</p>
            )}
          </div>

          <div className="form-section">
            <button type="submit" className="btn-primary">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
