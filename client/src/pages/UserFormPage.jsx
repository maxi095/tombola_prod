import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

function UserFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { createUser, getUser, updateUser } = useUsers();
  const { errors: userErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function loadUser() {
      if (params.id) {
        const user = await getUser(params.id);
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("firstName", user.person.firstName || "");
        setValue("lastName", user.person.lastName || "");
        setValue("document", user.person.document || "");
        setValue("roles", user.roles || "");
      }
    }

    loadUser();
  }, [params.id]);

  const onSubmit = handleSubmit(async (data) => {
    const dataValid = {
      username: data.username,
      email: data.email,
      roles: data.roles,
      person: {
        firstName: data.firstName,
        lastName: data.lastName,
        document: data.document,
        address: data.address,
        phone: data.phone,
        email: data.email,
      },
    };

    if (params.id) {
      await updateUser(params.id, dataValid);
    } else {
      await createUser({ ...data, password: data.password });
    }

    navigate("/users");
  });

  return (
    <div className="page-wrapper">
      <div className="form-card">
        <h2 className="title">{params.id ? "Editar Usuario" : "Registrar Usuario"}</h2>

        {userErrors.map((error, i) => (
          <p className="form-error" key={i}>{error}</p>
        ))}

        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-section">
            <label className="label">Username *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Username"
              {...register("username", { required: "Username es requerido" })}
              autoFocus
            />
            {errors.username && <p className="form-error">{errors.username.message}</p>}
          </div>

          <div className="form-section">
            <label className="label">Email *</label>
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              {...register("email", { required: "Email es requerido" })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          {!params.id && (
            <div className="form-section">
              <label className="label">Contraseña *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Contraseña"
                {...register("password", { required: "Contraseña es requerida" })}
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
          )}

          <div className="form-section">
            <label className="label">Nombre</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nombre"
              {...register("firstName")}
            />
          </div>

          <div className="form-section">
            <label className="label">Apellido</label>
            <input
              type="text"
              className="form-input"
              placeholder="Apellido"
              {...register("lastName")}
            />
          </div>

          <div className="form-section">
            <label className="label">Documento</label>
            <input
              type="number"
              className="form-input"
              placeholder="Documento"
              {...register("document")}
            />
          </div>

          <div className="form-section">
            <label className="label">Rol *</label>
            <select
              className="form-input"
              {...register("roles", { required: "El rol es obligatorio" })}
            >
              <option value="">Seleccione un rol</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Administrador">Administrador</option>
            </select>
            {errors.roles && <p className="form-error">{errors.roles.message}</p>}
          </div>

          <button type="submit" className="btn-primary mt-4">
            {params.id ? "Actualizar Usuario" : "Registrar Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserFormPage;
