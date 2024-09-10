import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { FRONTEND_URL } from './config.js';

import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import activityRoutes from './routes/activity.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import dimensionRoutes from './routes/dimension.routes.js';
import academicUnitRoutes from './routes/academicUnit.routes.js';
import activityProjectRoutes from './routes/activityProject.routes.js';

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", taskRoutes);
app.use("/api", activityRoutes);
app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", dimensionRoutes);
app.use("/api", academicUnitRoutes);
app.use("/api", activityProjectRoutes);


export default app;
