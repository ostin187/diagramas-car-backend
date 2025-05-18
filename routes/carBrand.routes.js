import express from 'express';
import * as carBrandController from '../controllers/carBrand.controller.js';
import * as carBrandMiddleware from '../middlewares/carBrand.middleware.js';
import * as authMiddleware from '../modules/user/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.get('/:id', carBrandController.findAll);

router
  .route('/:id')
  .post(carBrandController.create)
  .patch(carBrandMiddleware.validExistCarBrand, carBrandController.update)
  .delete(
    carBrandMiddleware.validExistCarBrand,
    carBrandController.deleteElement
  );

const carBrandRouter = router;

export { carBrandRouter };
