import express from 'express';
import * as carModelController from '../controllers/carModel.controller.js';
import * as carModelMiddleware from '../middlewares/carModel.middleware.js';
import * as authMiddleware from '../modules/user/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.get('/all/:id', carModelController.findAll);

router
  .route('/:id')
  .get(carModelMiddleware.validExistCarModel, carModelController.findOne)
  .post(carModelController.create)
  .patch(carModelMiddleware.validExistCarModel, carModelController.update)
  .delete(
    carModelMiddleware.validExistCarModel,
    carModelController.deleteElement
  );

const carModelRouter = router;

export { carModelRouter };
