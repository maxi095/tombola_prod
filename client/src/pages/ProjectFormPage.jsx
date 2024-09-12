import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectContext"; 
import { useDimensions } from "../context/DimensionContext"; 
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

dayjs.extend(utc);

function ProjectFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { createProject, getProject, updateProject } = useProjects();
  const { dimensions, getDimensions } = useDimensions(); 
  const { errors: projectErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // Cargar dimensiones solo una vez
  useEffect(() => {
    const loadDimensions = async () => {
      try {
        await getDimensions(); 
      } catch (error) {
        console.error("Error loading dimensions:", error);
      }
    };

    loadDimensions();
  }, []); // Este efecto solo se ejecutará una vez cuando el componente se monte

  // Cargar el proyecto solo si params.id está definido
  useEffect(() => {
    const loadProject = async () => {
      if (params.id) {
        try {
          const project = await getProject(params.id);
          if (project) {
            setValue("name", project.name);
            setValue("description", project.description);
            setValue("dimension", project.dimension?._id);
          }
        } catch (error) {
          console.error("Error loading project:", error);
        }
      }
    };

    loadProject();
  }, [params.id, getProject, setValue]); // Asegúrate de que getProject sea estable

  const onSubmit = handleSubmit(async (data) => {
    const dataValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
    };

    try {
      if (params.id) {
        await updateProject(params.id, dataValid);
      } else {
        await createProject(dataValid);
      }
      navigate('/projects');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  return (
    <div className="flex-center-container">
      <div className="inner-box">
      <h2 className="form-sub-title">Proyecto</h2>
        {
          projectErrors.map((error, i) => (
            <div className="form-error" key={i}>
              {error}
            </div>
          ))
        }
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className="form-label">Nombre del proyecto</label>
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

          <label htmlFor="dimension" className="form-label">Dimensión</label>
          <select
            {...register("dimension", { required: true })}
            className="form-select"
          >
            <option value="">Selecciona una dimensión</option>
            {dimensions.map((unit) => (
              <option key={unit._id} value={unit._id}>{unit.name}</option>
            ))}
          </select>
          {errors.dimension && <p className="form-error">La dimensión es requerida</p>}

          <button type="submit" className="button button--save">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormPage;
