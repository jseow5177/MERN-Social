import Post from '../models/post.model';
import formidable from 'formidable';
import fs from 'fs';

const listNewsFeed = async (req, res, next) => {

    const following = req.profile.following;
    following.push(req.profile._id);

    const lastPostId = req.params.lastPostId;

    const validId = lastPostId === '-1'

    const query = validId ? { postedBy: { $in: following } } : { postedBy: { $in: following }, _id: { $lt: lastPostId } };

    try {
        // Find posts posted by the user and his/her followers
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(5)
            .populate('comments.postedBy', '_id name') // Users who commented on the post
            .populate('postedBy', '_id name') // User who posted the post
            .exec();
        return res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Error in retrieving all posts. Please try again later.'
        });
    }
}

const listByUser = async (req, res, next) => {

    const lastPostId = req.params.lastPostId;

    const validId = lastPostId === '-1'

    const query = validId ? { postedBy: req.profile._id } : { postedBy: req.profile._id, _id: { $lt: lastPostId } };

    try {
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(5)
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({
            error: 'Error in retrieving posts. Please try again later.'
        })
    }
}

const create = async (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'Image cannot be uploaded' });
        }
        const post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        try {
            const result = await post.save();
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({
                error: 'Failed to upload post. Please try again later.'
            });
        }
    });
}

const postById = async (req, res, next, id) => {
    try {
        const post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .exec();
        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            })
        }
        req.post = post;
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Could not retrieve post.'
        })
    }
}

const photo = (req, res, next) => {
    if (req.post.photo.data) {
        res.set('Content-Type', req.post.photo.contentType);
        return res.send(req.post.photo.data);
    }
}

const isPoster = (req, res, next) => {
    // Check if user who removes post is the poster
    const isPoster = req.post && req.user && req.post.postedBy._id.toString() === req.user._id;
    if (!isPoster) {
        return res.status(403).json({
            error: 'User is not authorized'
        });
    }
    next();
}

const remove = async (req, res, next) => {
    try {
        await req.post.remove();
        return res.status(200).json(req.post);
    } catch (err) {
        return res.status(400).json({
            error: 'Failed to delete. Please try again later'
        });
    }
}

const like = async (req, res, next) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true });
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: 'Error in liking post'
        });
    }
}

const unlike = async (req, res, next) => {
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true });
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: 'Error in unliking post'
        });
    }
}

const comment = async (req, res, next) => {
    const comment = {}
    comment.text = req.body.comment;
    comment.postedBy = req.body.userId;
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();
        return res.status(200).json(result); // Sends back updated post with new comment
    } catch (err) {
        return res.status(400).json({
            error: 'Error in posting comment'
        });
    }
}


const uncomment = async (req, res, next) => {
    const comment = req.body.comment;
    try {
        const result = await Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .exec();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: 'Error in deleting comment'
        });
    }
}

export default { listNewsFeed, listByUser, create, postById, photo, isPoster, remove, like, unlike, comment, uncomment };