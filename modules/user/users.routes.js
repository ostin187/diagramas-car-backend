import express from 'express';
import * as userMiddleware from './user.middleware.js';
import * as authMiddleware from './auth.middleware.js';
import * as userController from './user.controllers.js';

const router = express.Router();

router.post('/login', userController.login);
router.post('/login/admin', userController.loginAdmin);
router.use(authMiddleware.protect);

router.post('/signup', userController.signup);
router.get(
  '/verified-membership/:id',
  userMiddleware.validExistUser,
  userController.updateMembership
);

router.get('/', userController.findAll);
router
  .use('/:id', userMiddleware.validExistUser)
  .route('/:id')
  .patch(userController.update)
  .delete(userController.deleteUser)
  .get(userController.findOne);

const usersRouter = router;

export { usersRouter };
