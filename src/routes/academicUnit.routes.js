import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getAcademicUnit,
    getAcademicUnits,
    createAcademicUnit,
    updateAcademicUnit,
    deleteAcademicUnit 
} from "../controllers/academicUnit.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createAcademicUnitSchema } from "../schemas/academicUnit.schema.js";

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router()

router.get('/academic-units', authRequired, checkRole(['Administrador']), getAcademicUnits);
router.get('/academic-units/:id', authRequired, checkRole(['Administrador']), getAcademicUnit);
router.post('/academic-units', authRequired, checkRole(['Administrador']), validateSchema(createAcademicUnitSchema), createAcademicUnit);
router.delete('/academic-units/:id', authRequired, checkRole(['Administrador']), deleteAcademicUnit);
router.put('/academic-units/:id', authRequired, checkRole(['Administrador']), updateAcademicUnit);

export default router;
