import express from 'express';
import userController from '../controllers/user.controller';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/users/notfollow/:userId')
    .get(authController.requireSignin, userController.findPeople);

router.route('/api/users/follow')
    .put(authController.requireSignin, userController.addFollowing, userController.addFollower);

router.route('/api/users/unfollow')
    .put(authController.requireSignin, userController.removeFollowing, userController.removeFollower);

// First, checks if user has a photo
// If no, calls next() and get the default photo
router.route('/api/users/photo/:userId')
    .get(userController.photo, userController.defaultPhoto);

router.route('/api/users/defaultPhoto')
    .get(userController.defaultPhoto);

router.route('/api/users')
    .get(userController.list)
    .post(userController.create)

router.route('/api/users/:userId/edit-password')
    .put(authController.requireSignin, authController.hasAuthorization, userController.updatePassword)

router.route('/api/users/:userId')
    .get(authController.requireSignin, userController.read)
    .put(authController.requireSignin, authController.hasAuthorization, userController.update)
    .delete(authController.requireSignin, authController.hasAuthorization, userController.remove)

// Whenever a request hits a route that has the :userId parameter in it, this controller function will be executed
// Once the controller function is completed, it will propagate to the next function
// The value of the userId will be passed to the controller function as an argument
router.param('userId', userController.userById)

export default router;