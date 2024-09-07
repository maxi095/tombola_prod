import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { getAcademicUnitsRequest } from "../api/academicUnit"; // Asumiendo que tienes esta función

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function UserFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { createUser, getUser, updateUser } = useUsers();
  const { errors: userErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [academicUnits, setAcademicUnits] = useState([]);

  useEffect(() => {
    async function loadUser() {
      if (params.id) {
        const user = await getUser(params.id);
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("firstName", user.firstName || '');
        setValue("lastName", user.lastName || '');
        setValue("document", user.document || '');
        setValue("academicUnit", user.academicUnit?._id || '');
        setValue("roles", user.roles || '');
      }
    }
    
    async function loadAcademicUnits() {
      const res = await getAcademicUnitsRequest();
      setAcademicUnits(res.data);
    }
    
    loadUser();
    loadAcademicUnits();
  }, [params.id, getUser, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const dataValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
      academicUnit: data.academicUnit || null,
    };
    if (params.id) {
      await updateUser(params.id, dataValid);
    } else {
      await createUser(dataValid);
    }
    
    navigate('/users');
  });

  return (
    <div className="flex h-full items-center justify-center py-6 md:py-12">
      <div className="inner-box">
      <h2 className="form-sub-title">Usuario</h2>
        {userErrors.map((error, i) => (
          <div className="form-error" key={i}>
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          <div>
            <div>
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                placeholder="Username"
                {...register("username", { required: true })} 
                className="form-input" 
                autoFocus
              />
              {errors.username && <p className="form-error">Username es requerido</p>}
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                placeholder="Email"
                {...register("email", { required: true })} 
                className="form-input" 
              />
              {errors.email && <p className="form-error">Email es requerido</p>}
            </div>

            {!params.id && (
              <div>
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  {...register("password", { required: true })} 
                  className="form-input" 
                />
                {errors.password && <p className="form-error">Contraseña es requerida para nuevo usuario</p>}
              </div>
            )}

            <div>
              <label htmlFor="firstName" className="form-label">Nombre</label>
              <input 
                type="text" 
                placeholder="Nombre"
                {...register("firstName")} 
                className="form-input" 
              />
              {errors.firstName && <p className="form-error">Nombre es requerido</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="form-label">Apellido</label>
              <input 
                type="text" 
                placeholder="Apellido"
                {...register("lastName")} 
                className="form-input" 
              />
              {errors.lastName && <p className="form-error">Apellido es requerido</p>}
            </div>

            <div>
              <label htmlFor="document" className="form-label">Documento</label>
              <input 
                type="number" 
                placeholder="Documento"
                {...register("document")} 
                className="form-input" 
              />
            </div>

            <div>
              <label htmlFor="academicUnit" className="form-label">Unidad Académica</label>
              <select
                {...register("academicUnit", { required: false })}
                className="form-input"
              >
                <option value="">Seleccione una unidad académica</option>
                {academicUnits.map((unit) => (
                  <option key={unit._id} value={unit._id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="roles" className="form-label">Rol</label>
              <select
                {...register("roles", { required: true })} 
                className="form-input"
              >
                <option value="">Seleccione un rol</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Director">Director</option>
                <option value="Secretario">Secretario</option>
                <option value="Administrador">Administrador</option>
              </select>
              {errors.roles && <p className="form-error">Rol es requerido</p>}
            </div>
          </div>

          <button 
            type="submit" 
            className="button button--save"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserFormPage;
