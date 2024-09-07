import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getProject,
    getProjects,
    createProject,
    updateProject,
    deleteProject } 
from "../controllers/project.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createProjectSchema } from "../schemas/project.schema.js";

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router()

router.get('/projects', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getProjects);
router.get('/projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getProject);
router.post('/projects', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), validateSchema(createProjectSchema), createProject);
router.delete('/projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), deleteProject);
router.put('/projects/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), updateProject);

export default router