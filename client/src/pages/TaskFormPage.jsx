import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc)

function TaskFormPage() {

  const {register, 
    handleSubmit, 
    formState: {errors}, 
    setValue} = useForm();
  const {createTask, getTask, updateTask} = useTasks();
  const {errors: taskErrors} = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  
  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        console.log(task)
        setValue('title', task.title)
        setValue('description', task.description)
        setValue('date', dayjs.utc(task.date).format("YYYY-MM-DD"))
      }
    }
    loadTask()
  }, []);

  const onSubmit = handleSubmit((data) => {
    const dataValid = {
      ...data,
      date: data.date ? dayjs.utc(data.date).format() : dayjs.utc().format(),
    };

    if (params.id) {
      updateTask(params.id, dataValid);
    } else {
      createTask(dataValid);
    }
    
    navigate('/tasks');

  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center">
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      {
          taskErrors.map((error, i ) => (
              <div className="bg-red-500 p-2 text-white my-2" key={i}>
                {error}
              </div>
              ))
      }

        <form onSubmit={onSubmit}>
          <label htmlFor="title">title</label>
          <input type="text" placeholder="Title"
          {...register('title', {required: true})}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" 
          autoFocus
          />
          {errors.title && <p className = "text-red-500">Título es requerido</p>}
          <label htmlFor="description">description</label>
          <textarea rows="3" placeholder="Description"
          {...register('description', {required: true})}
          className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" 
          />
          {errors.description && <p className = "text-red-500">Descripción es requerido</p>}

          <label htmlFor="date">date</label>
          <input type="date" {...register('date')} className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2" />

          <button className="bg-indigo-500 px-3 py-2 rounded-md">
            Save
          </button>

        </form>

      </div>
    </div>
  )
}

export default TaskFormPage