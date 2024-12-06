import { Router } from 'express';
import { FileUploadController } from './controller';
import { AuthMiddlewWare } from '../middlewares/auth.middleware';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';
import { TypeMiddleware } from '../middlewares/type.middleware';

export class FileUploadRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new FileUploadService();
    const controller = new FileUploadController(service);

    router.use(AuthMiddlewWare.validateJwt);
    router.use(FileUploadMiddleware.containFails);
    router.use(TypeMiddleware.validTypes(['users', 'products', 'categories']));

    router.post('/single/:type', controller.uploadFile);
    router.post('/multiple/:type', controller.uploadMultipleFiles);

    return router;
  }
}
