import { Router } from 'express';
import { AuthMiddlewWare } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductService } from '../services';

export class ProductRoutes {
  static get routes(): Router {
    const router = Router();
    const productsService = new ProductService();
    const controller = new ProductController(productsService);

    router.get('/', controller.getProducts);
    router.post('/', [AuthMiddlewWare.validateJwt], controller.createProduct);

    return router;
  }
}
