import express from 'express';
import * as yearCarController from '../controllers/yearCar.controller.js';
import * as yearCarMiddleware from '../middlewares/yearCar.middleware.js';
import * as authMiddleware from '../modules/user/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.get('/', yearCarController.findAll);

router
  .route('/:id')
  .get(yearCarMiddleware.validExistYearCar, yearCarController.findOne)
  .post(yearCarController.create)
  .patch(yearCarMiddleware.validExistYearCar, yearCarController.update)
  .delete(yearCarMiddleware.validExistYearCar, yearCarController.deleteElement);

const yearCarRouter = router;

export { yearCarRouter };
