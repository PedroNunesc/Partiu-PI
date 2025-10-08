import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const itemController = new ItemController();
const auth = new AuthMiddleware();

router.get('/trip', itemController.list);
router.get('/trip/:id', itemController.show);

router.post('/trip', auth.authenticateToken, itemController.create);
router.put('/trip/:id', auth.authenticateToken, itemController.update);
router.delete('/trip/:id', auth.authenticateToken, itemController.delete);

export default router;
