import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getInstallments,
    getInstallment,
    createInstallment,
    updateInstallment,
    deleteInstallment
} from "../controllers/installment.controllers.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Listar todas las cuotas
router.get('/installments', authRequired, checkRole(['Administrador', 'Director']), getInstallments);

// Obtener una cuota por ID
router.get('/installment/:id', authRequired, checkRole(['Administrador', 'Director']), getInstallment);

// Crear una nueva cuota
router.post('/installment', authRequired, checkRole(['Administrador', 'Director']), createInstallment);

// Editar una cuota
router.put('/installment/:id', authRequired, checkRole(['Administrador', 'Director']), updateInstallment);

// Eliminar una cuota
router.delete('/installment/:id', authRequired, checkRole(['Administrador']), deleteInstallment);

export default router;
