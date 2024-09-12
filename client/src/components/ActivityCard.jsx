import { useActivity } from "../context/ActivityContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { act } from "react";
import '../assets/css/Global.css';

dayjs.extend(utc);

function ActivityCard({ activity }) {
    const { deleteActivity } = useActivity();
    return (
        <div className="activity-card">
            {/*<header className="activity-card-header">
                <h1 className="activity-card-title">{activity.activityProjectId?.project?.name}</h1>
            </header>
            <p className="activity-card-text">Estudiante: {activity.studentId?.username}</p>*/}

            <header className="activity-card-header">
            <h1 className="activity-card-title">Actividad: {activity.activityProjectId?.name}</h1>
            </header>
            <p className="activity-card-text">Fecha: {dayjs(activity.dateActivity).utc().format('YYYY-MM-DD')}</p>
            <p className="activity-card-text">Horas acreditadas: {activity.activityProjectId?.hours}</p>
        </div>
    );
}

export default ActivityCard;
