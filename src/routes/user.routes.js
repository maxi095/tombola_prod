import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser } 
    from "../controllers/user.controllers.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import {createUserSchema} from "../schemas/user.schema.js";

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router()

router.get('/users', authRequired, checkRole(['Administrador']), getUsers);
router.get('/users/:id', authRequired, checkRole(['Administrador']), getUser);
router.post('/users', authRequired, checkRole(['Administrador']), validateSchema(createUserSchema), createUser);
router.delete('/users/:id', authRequired, checkRole(['Administrador']), deleteUser);
router.put('/users/:id', authRequired, checkRole(['Administrador']), updateUser);

export default router