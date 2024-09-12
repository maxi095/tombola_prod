import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActivityProjects } from "../context/ActivityProjectContext"; 
import { useProjects } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Select from 'react-select'; 
import { customSelectStyles } from '../styles/reactSelectStyles';

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

dayjs.extend(utc);

function ActivityProjectFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { createActivityProject, getActivityProject, updateActivityProject } = useActivityProjects();
  const { projects, getProjects } = useProjects(); 
  const { errors: activityErrors } = useAuth(); 
  const navigate = useNavigate();
  const params = useParams();

  const [selectedProject, setSelectedProject] = useState(null);
  const [projectError, setProjectError] = useState(false); // Nueva variable para el error de proyecto

  useEffect(() => {
    const loadProjects = async () => {
      try {
        await getProjects(); 
      } catch (error) {
        console.error("Error loading projects:", error);
      }
    };

    loadProjects();
  }, [getProjects]);

  useEffect(() => {
    const loadActivityProject = async () => {
      if (params.id) {
        try {
          const activityProject = await getActivityProject(params.id);
          if (activityProject) {
            setValue("name", activityProject.name);
            setValue("description", activityProject.description);
            setValue("dateActivity", dayjs.utc(activityProject.dateActivity).format("YYYY-MM-DD"));  // Formatear para input tipo "date"
            setValue("hours", activityProject.hours); 

            // Set the selected project in the state
            const selectedProj = projects.find(p => p._id === activityProject.project?._id);
            if (selectedProj) {
              setSelectedProject({ value: selectedProj._id, label: selectedProj.name });
            }
          }
        } catch (error) {
          console.error("Error loading activity project:", error);
        }
      }
    };

    loadActivityProject();
  }, [params.id, getActivityProject, setValue, projects]);

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedProject) {
      setProjectError(true); // Mostrar mensaje de error si no se selecciona proyecto
      return;
    }

    const dataValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
      project: selectedProject.value, // Asigna el valor del proyecto seleccionado
      dateActivity: dayjs.utc(data.dateActivity).format(),  // Formatear a UTC
      hours: Number(data.hours), // Asegurarse de que es un número
    };

    try {
      if (params.id) {
        await updateActivityProject(params.id, dataValid);
      } else {
        await createActivityProject(dataValid);
      }
      navigate('/activity-projects'); 
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  // Validación personalizada para el selector de proyecto
  const handleProjectChange = (option) => {
    setSelectedProject(option);
    setProjectError(false); // Quitar mensaje de error al seleccionar un proyecto
  };

  return (
    <div className="flex-center-container">
      <div className="inner-box">
        <h2 className="form-sub-title">Actividad de proyecto</h2>
        {
          activityErrors?.map((error, i) => (
            <div className="form-error" key={i}>
              {error}
            </div>
          ))
        }
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className="form-label">Nombre de la actividad</label>
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

          <label htmlFor="project" className="form-label">Proyecto</label>
          <Select
            value={selectedProject}
            onChange={handleProjectChange}
            options={projects.map(p => ({ value: p._id, label: p.name }))}
            placeholder="Selecciona un proyecto"
            styles={customSelectStyles}
            className="my-2"
          />
          {projectError && <p className="form-error">El proyecto es requerido</p>} {/* Mostrar error solo si no se selecciona proyecto */}

          <label htmlFor="dateActivity" className="form-label">Fecha</label>
          <input 
            type="date" 
            {...register('dateActivity', { required: "Fecha de la actividad es requerida" })}
            className="form-input" 
          />
          {errors.dateActivity && <p className="form-error">{errors.dateActivity.message}</p>}

          <label htmlFor="hours" className="form-label">Horas acreditadas</label>
          <input
            type="number"
            placeholder="Horas"
            {...register("hours", { required: true, valueAsNumber: true })}
            className="form-input"
          />
          {errors.hours && <p className="form-error">Las horas acreditadas son requeridas</p>}

          <button type="submit" className="button button--save">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default ActivityProjectFormPage;
