import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getDimension,
    getDimensions,
    createDimension,
    updateDimension,
    deleteDimension 
} from "../controllers/dimension.controllers.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createDimensionSchema } from "../schemas/dimension.schema.js";

import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get('/dimensions', authRequired, checkRole(['Administrador']), getDimensions);
router.get('/dimensions/:id', authRequired, checkRole(['Administrador']), getDimension);
router.post('/dimensions', authRequired, checkRole(['Administrador']), validateSchema(createDimensionSchema), createDimension);
router.delete('/dimensions/:id', authRequired, checkRole(['Administrador']), deleteDimension);
router.put('/dimensions/:id', authRequired, checkRole(['Administrador']), updateDimension);

export default router;
