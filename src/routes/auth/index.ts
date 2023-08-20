import express from 'express';
import { AuthController } from '../../controllers/auth';
import { isAuthenticated } from '../../middlewares';

const authRouter = express.Router();

authRouter.post('/login', AuthController.handle);
authRouter.get('/profile', isAuthenticated, AuthController.profile);
authRouter.post('/refresh', isAuthenticated, AuthController.refresh);
authRouter.post('/revoke', AuthController.revoke);

export { authRouter };
