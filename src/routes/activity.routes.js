import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getActivities, 
    getActivity, 
    createActivity, 
    updateActivity, 
    deleteActivity,
    getActivitiesByUser,
    getUsersByActivity
} from "../controllers/activity.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createActivitySchema } from "../schemas/activity.schema.js";

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router()

router.get('/activity', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getActivities);
router.get('/activity/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getActivity);
router.post('/activity', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), validateSchema(createActivitySchema), createActivity);
router.delete('/activity/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), deleteActivity);
router.put('/activity/:id', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), updateActivity);
router.get('/activities/user/:userId', authRequired, checkRole(['Administrador', 'Secretario', 'Director', 'Estudiante']), getActivitiesByUser); // Añadido authRequired para proteger esta ruta
router.get('/activities/:activityId/users', authRequired, checkRole(['Administrador', 'Secretario', 'Director']), getUsersByActivity);

export default router
