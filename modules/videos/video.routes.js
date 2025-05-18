import express from 'express';
import * as videoController from './video.controller.js';
import * as videoMiddleware from './video.middleware.js';

import * as authMiddleware from '../user/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware.protect);
router.get('/', videoController.findAll);
router.post('/', videoController.create);

router
  .route('/:id')
  .get(videoMiddleware.validExistVideo, videoController.findOne)
  .patch(videoMiddleware.validExistVideo, videoController.update)
  .delete(videoMiddleware.validExistVideo, videoController.deleteElement);

const videoRouter = router;

export { videoRouter };
