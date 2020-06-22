import express from 'express';
import authController from '../controllers/auth.controller';
import postController from '../controllers/post.controller';
import userController from '../controllers/user.controller';

const router = express.Router();

router.route('/api/posts/new/:userId')
    .post(authController.requireSignin, postController.create)

router.route('/api/posts/feed/:userId')
    .get(authController.requireSignin, postController.listNewsFeed)

router.route('/api/posts/by/:userId')
    .get(authController.requireSignin, postController.listByUser)

router.route('/api/posts/photo/:postId')
    .get(postController.photo);

router.param('userId', userController.userById);

router.param('postId', postController.postById);

export default router;