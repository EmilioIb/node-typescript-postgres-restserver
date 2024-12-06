import { Router } from 'express';
import { ImageController } from './controller';
import { AuthMiddlewWare } from '../middlewares/auth.middleware';

export class ImageRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ImageController();

    router.use(AuthMiddlewWare.validateJwt);

    router.get('/:type/:image', controller.getImage);

    return router;
  }
}
