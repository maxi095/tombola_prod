
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { customSelectStyles } from '../styles/reactSelectStyles';
import { useActivity } from "../context/ActivityContext";
import { useUsers } from "../context/UserContext";
import { useActivityProjects } from "../context/ActivityProjectContext";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

dayjs.extend(utc);

function ActivityFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm();
  const { createActivity, getActivity, updateActivity } = useActivity();
  const { getUsers, users = [] } = useUsers();
  const { getActivityProjects, activityProjects = [] } = useActivityProjects();
  const { errors: activityErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null); 
  const [selectedStudent, setSelectedStudent] = useState(null); 

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([getUsers(), getActivityProjects()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadActivity = async () => {
      if (params.id) {
        try {
          const activity = await getActivity(params.id);
          if (activity) {
            setSelectedStudent({
              value: activity.studentId?._id,
              label: `${activity.studentId?.firstName} ${activity.studentId?.lastName} (${activity.studentId?.document})`
            });
            setSelectedProject({
              value: activity.activityProjectId?.project?._id,
              label: activity.activityProjectId?.project?.name
            });
            setSelectedActivity({
              value: activity.activityProjectId?._id,
              label: activity.activityProjectId?.name
            });
          }
        } catch (error) {
          console.error("Error loading activity:", error);
        }
      }
    };
    loadActivity();
  }, [params.id, getActivity, setValue]);

  useEffect(() => {
    if (selectedProject) {
      const filtered = activityProjects.filter(activityProject => activityProject.project?._id === selectedProject.value);
      setFilteredActivities(filtered);
    } else {
      setFilteredActivities([]);
    }
  }, [selectedProject, activityProjects]);

  const handleProjectChange = (selectedOption) => {
    setSelectedProject(selectedOption);
    setSelectedActivity(null); 
    if (selectedOption) {
      clearErrors("projectId");
    } else {
      setError("projectId", { type: "manual", message: "Proyecto es requerido" });
    }
  };

  const handleActivityChange = (selectedOption) => {
    setSelectedActivity(selectedOption);
    if (selectedOption) {
      clearErrors("activityProjectId");
    } else {
      setError("activityProjectId", { type: "manual", message: "Actividad del proyecto es requerida" });
    }
  };

  const handleStudentChange = (selectedOption) => {
    setSelectedStudent(selectedOption);
    if (selectedOption) {
      clearErrors("studentId");
    } else {
      setError("studentId", { type: "manual", message: "Estudiante es requerido" });
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedStudent) {
      setError("studentId", { type: "manual", message: "Estudiante es requerido" });
      return;
    }

    if (!selectedProject) {
      setError("projectId", { type: "manual", message: "Proyecto es requerido" });
      return;
    }

    if (!selectedActivity) {
      setError("activityProjectId", { type: "manual", message: "Actividad del proyecto es requerida" });
      return;
    }

    const dataValid = {
      ...data,
      studentId: selectedStudent ? selectedStudent.value : null,
      projectId: selectedProject ? selectedProject.value : null,
      activityProjectId: selectedActivity ? selectedActivity.value : null,
      
    };
    //console.log(dataValid)

    try {
      if (params.id) {
        await updateActivity(params.id, dataValid);
      } else {
        await createActivity(dataValid);
      }
      navigate('/activities');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  });

  return (
    <div className="flex-center-container">
      
      <div className="inner-box">
      <h2 className="form-sub-title">Actividad de estudiante</h2>
        {activityErrors.map((error, i) => (
          <div className="form-error" key={i}>
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit}>
          {/* Campo para seleccionar el estudiante usando react-select */}
          <label htmlFor="studentId" className="form-label">Estudiante</label>
          <Select
            value={selectedStudent}
            onChange={handleStudentChange}
            options={users.map(user => ({
              value: user._id,
              label: `${user.firstName} ${user.lastName} (DNI ${user.document})`,
              data: user // Agregamos los datos del usuario a la opción
            }))}
            className="my-2"
            placeholder="Seleccione un estudiante"
            styles={customSelectStyles}
            isClearable
            filterOption={(option, inputValue) => 
              option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
              (option.data.document && option.data.document.toString().includes(inputValue))
            }
          />
          {errors.studentId && <p className="form-error">{errors.studentId.message}</p>}

          {/* Campo para seleccionar el proyecto usando react-select */}
          <label htmlFor="projectId" className="form-label">Proyecto</label>
          <Select
  value={selectedProject}
  onChange={handleProjectChange}
  // Filtrar proyectos únicos usando reduce
  options={activityProjects
    .reduce((acc, activity) => {
      const projectExists = acc.find(proj => proj.value === activity.project?._id);
      if (!projectExists && activity.project) {
        acc.push({
          value: activity.project._id,
          label: activity.project.name
        });
      }
      return acc;
    }, [])
  }
  className="my-2"
  placeholder="Seleccione un proyecto"
  styles={customSelectStyles}
  isClearable
/>
          {errors.projectId && <p className="form-error">{errors.projectId.message}</p>}

          {/* Campo para seleccionar la actividad de proyecto usando react-select */}
          <label htmlFor="activityProjectId" className="form-label">Actividad</label>
          <Select
            value={selectedActivity}
            onChange={handleActivityChange}
            options={filteredActivities.map(activityProject => ({
              value: activityProject._id,
              label: `${activityProject.name} (${activityProject.hours} hs)`
            }))}
            className="my-2"
            placeholder="Seleccione una actividad"
            styles={customSelectStyles}
            isClearable
            isDisabled={!selectedProject} 
          />
          {errors.activityProjectId && <p className="form-error">{errors.activityProjectId.message}</p>}

          <button type="submit" className="button button--save">Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default ActivityFormPage;
