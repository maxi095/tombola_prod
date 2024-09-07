import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getActivityProjects, 
    getActivityProject, 
    createActivityProject, 
    updateActivityProject, 
    deleteActivityProject 
} from "../controllers/activityProject.controllers.js"; // Asegúrate de que el nombre del controlador sea correcto
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createActivityProjectSchema, updateActivityProjectSchema } from "../schemas/activityProject.schema.js"; // Asegúrate de tener los esquemas necesarios

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Rutas para ActivityProject
router.get('/activity-projects', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getActivityProjects);
router.get('/activity-projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getActivityProject);
router.post('/activity-projects', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), validateSchema(createActivityProjectSchema), createActivityProject);
router.delete('/activity-projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), deleteActivityProject);
router.put('/activity-projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), validateSchema(updateActivityProjectSchema), updateActivityProject);

export default router;
