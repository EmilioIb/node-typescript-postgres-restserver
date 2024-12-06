import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddlewWare } from '../middlewares/auth.middleware';
import { CategoryService } from '../services';

export class CategoryRoutes {
  static get routes(): Router {
    const router = Router();
    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    router.get('/', controller.getCategories);
    router.post('/', [AuthMiddlewWare.validateJwt], controller.createCategory);

    return router;
  }
}
