import { Router } from "express";
import {
  getPeople,
  getPerson,
  updatePerson,
  deletePerson
} from "../controllers/person.controllers.js";

import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Notas:
// No hay POST de person porque se crean desde seller/client
router.get("/people", authRequired, checkRole(["Administrador"]), getPeople);
router.get("/people/:id", authRequired, checkRole(["Administrador"]), getPerson);
router.put("/people/:id", authRequired, checkRole(["Administrador"]), updatePerson);
router.delete("/people/:id", authRequired, checkRole(["Administrador"]), deletePerson);

export default router;
