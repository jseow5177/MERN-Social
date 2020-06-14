import express from 'express';
import userController from '../controllers/user.controller';

const router = express.Router();

router.route('/api/users')
    .get(userController.list)
    .post(userController.create)

router.route('/api/users/:userId')
    .get(userController.read)
    .put(userController.update)
    .delete(userController.remove)

// Whenever a request hits a route that has the :userId parameter in it, this controller function will be executed
// Once the controller function is completed, it will propagate to the next function
// The value of the userId will be passed to the controller function as an argument
router.param('userId', userController.userById)

export default router;