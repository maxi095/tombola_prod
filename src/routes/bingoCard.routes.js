import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { 
    getBingoCards,
    getBingoCard,
    createBingoCard,
    updateBingoCard,
    deleteBingoCard,
    getBingoCardsWithSales,
    getBingoCardStatus,
    assignSellerToBingoCard,
    removeSellerFromBingoCard,
    getBingoCardsBySeller
} from "../controllers/bingoCard.controllers.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = Router();

// Listar todas las tarjetas de bingo
router.get('/bingoCards', authRequired, checkRole(['Administrador']), getBingoCards);

// Obtener una tarjeta de bingo por ID
router.get('/bingoCard/:id', authRequired, checkRole(['Administrador']), getBingoCard);

// Crear una nueva tarjeta de bingo
router.post('/bingoCard', authRequired, checkRole(['Administrador']), createBingoCard);

// Editar una tarjeta de bingo
router.put('/bingoCard/:id', authRequired, checkRole(['Administrador']), updateBingoCard);

// Eliminar una tarjeta de bingo
router.delete('/bingoCard/:id', authRequired, checkRole(['Administrador']), deleteBingoCard);

// Listar todas las tarjetas de bingo con sus datos de venta
router.get('/bingoCardsWithSales', authRequired, checkRole(['Administrador']), getBingoCardsWithSales);


router.get('/bingoCardStatus', authRequired, checkRole(['Administrador']), getBingoCardStatus);

router.put('/bingoCard/assignSeller/:bingoCardId', authRequired, checkRole(['Administrador']), assignSellerToBingoCard);

router.put('/bingoCard/removeSeller/:bingoCardId', authRequired, checkRole(['Administrador']), removeSellerFromBingoCard);

router.get('/bingoCardsBySeller/:sellerId', authRequired, checkRole(['Administrador']), getBingoCardsBySeller);


export default router;
