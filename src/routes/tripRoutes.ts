import { Router } from 'express';
import { TripController } from '../controllers/TripController';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();
const tripController = new TripController();
const auth = new AuthMiddleware();

router.get('/trip', tripController.list);
router.get('/trip/:id', tripController.show);

router.post('/trip', auth.authenticateToken, tripController.create);
router.put('/trip/:id', auth.authenticateToken, tripController.update);
router.delete('/trip/:id', auth.authenticateToken, tripController.delete);

export default router;