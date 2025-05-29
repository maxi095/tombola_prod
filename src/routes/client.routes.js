import { Router } from "express";
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} from "../controllers/client.controllers.js";

import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/clients", authRequired, checkRole(["Administrador"]), getClients);
router.get("/clients/:id", authRequired, checkRole(["Administrador"]), getClient);
router.post("/clients", authRequired, checkRole(["Administrador"]), createClient);
router.put("/clients/:id", authRequired, checkRole(["Administrador"]), updateClient);
router.delete("/clients/:id", authRequired, checkRole(["Administrador"]), deleteClient);

export default router;
