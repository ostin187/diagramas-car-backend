import express from 'express';
import { upload } from '../../utils/multer.js';
import * as bannersController from './banners.controller.js';
import * as bannersMiddleware from './banners.middleware.js';

import * as authMiddleware from '../user/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.get('/', bannersController.findAll);
router.post('/', upload.single('file_banner'), bannersController.create);

router
  .route('/:id')
  .get(bannersMiddleware.validExistBanners, bannersController.findOne)
  .patch(bannersMiddleware.validExistBanners, bannersController.update)
  .delete(bannersMiddleware.validExistBanners, bannersController.deleteElement);

const bannersRouter = router;

export { bannersRouter };
