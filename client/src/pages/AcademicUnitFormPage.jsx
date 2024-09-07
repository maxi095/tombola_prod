import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcademicUnits } from "../context/AcademicUnitContext"; 
import { useAuth } from "../context/AuthContext";

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function AcademicUnitFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { createAcademicUnit, getAcademicUnit, updateAcademicUnit } = useAcademicUnits();
  const { errors: academicUnitErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // Cargar unidad académica solo si params.id está definido
  useEffect(() => {
    const loadAcademicUnit = async () => {
      if (params.id) {
        try {
          const academicUnit = await getAcademicUnit(params.id);
          if (academicUnit) {
            setValue("name", academicUnit.name);
            setValue("description", academicUnit.description);
          }
        } catch (error) {
          console.error("Error loading academic unit:", error);
        }
      }
    };

    loadAcademicUnit();
  }, [params.id, getAcademicUnit, setValue]); // Asegúrate de que getAcademicUnit sea estable

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (params.id) {
        await updateAcademicUnit(params.id, data);
      } else {
        await createAcademicUnit(data);
      }
      navigate('/academic-units');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  return (
    <div className="flex-center-container">
      <div className="inner-box">
      <h2 className="form-sub-title">Unidad académica</h2>
        {
          academicUnitErrors.map((error, i) => (
            <div className="form-error" key={i}>
              {error}
            </div>
          ))
        }
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            {...register("name", { required: true })}
            className="form-input"
            autoFocus
          />
          {errors.name && <p className="form-error">El nombre es requerido</p>}

          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
            placeholder="Descripción"
            {...register("description", { required: true })}
            className="form-textarea"
          />
          {errors.description && <p className="form-error">La descripción es requerida</p>}

          <button type="submit" className="button button--save">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default AcademicUnitFormPage;
