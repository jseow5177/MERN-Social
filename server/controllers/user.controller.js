import User from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler'; // Helper to respond to route requests when error occurs
import formidable from 'formidable'; // To parse form data and file uploads
import fs from 'fs';
import profileImage from './../../client/assets/images/profile-pic.png';

const create = async (req, res, next) => {
    const user = new User(req.body);
    try {
        await user.save();
        return res.status(200).json({
            message: 'User successfully signed up'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const list = async (req, res) => {
    try {
        const users = await User.find().select('name email updated created'); // Select only name, email, updated and created field
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({
            error: 'Could not retrieve all users'
        })
    }
}

const userById = async (req, res, next, id) => {

    try {
        const user = await User.findById(id)
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();
        if (!user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Could not retrieve user'
        });
    }
}

const read = async (req, res, next) => {
    return res.status(200).json(req.profile);
}

const update = async (req, res, next) => {

    const form = new formidable.IncomingForm();
    form.keepExtensions = true; // Include extensions of original file
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: 'Photo cannot be uploaded' });
        }
        /*
            fields: The typical req.body form data
            files: The file data
        */
        const user = req.profile;
        const updatedUser = extend(user, fields);
        updatedUser.updated = Date.now(); // To reflect the latest updated timestamp

        if (files.photo) {
            updatedUser.photo.data = fs.readFileSync(files.photo.path);
            updatedUser.photo.contentType = files.photo.type;
        }

        try {
            await updatedUser.save();
            updatedUser.hashedPassword = undefined; // Remove sensitive info
            return res.status(200).json(updatedUser);
        } catch (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    });

}

const remove = async (req, res, next) => {
    try {
        const user = req.profile;
        await user.remove();
        return res.status(200).json({ message: 'User successfully removed' });
    } catch (err) {
        return res.status(500).json({
            error: 'Could not delete. Please try again later.'
        })
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const user = req.profile;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(401).json({ error: 'Please fill in all fields' });
        }

        const isAuthenticated = await user.authenticate(oldPassword);
        if (!isAuthenticated) {
            return res.status(401).json({ error: 'Old password does not match.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(401).json({ error: 'Passwords do not match' });
        }

        user.password = newPassword;

        await user.save();

        return res.status(200).json({ message: 'Successfully changed password' });

    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const photo = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set('Content-Type', req.profile.photo.contentType);
        return res.status(200).send(req.profile.photo.data);
    }
    next();
}

const defaultPhoto = (req, res, next) => {
    // profileImage is compiled and placed in /dist
    // process.cwd() is the current working directory (/mern-skeleton)
    return res.status(200).sendFile(process.cwd() + profileImage);
}

const addFollower = async (req, res, next) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();
        result.hashedPassword = undefined;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: 'Fail to follow. Please try again later.'
        });
    }
}

const addFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } });
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Fail to follow. Please try again later.'
        });
    }
}

const removeFollower = async (req, res, next) => {
    try {
        const result = await User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
            .populate('following', '_id name')
            .populate('followers', '_id name')
            .exec();
        result.hashedPassword = undefined;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).json({
            error: 'Fail to unfollow. Please try again later.'
        })
    }
}

const removeFollowing = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } });
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Fail to unfollow. Please try again later.'
        })
    }
}

const findPeople = async (req, res, next) => {

    const following = req.profile.following;
    following.push(req.profile._id);

    try {
        const users = await User.find({ _id: { $nin: following } }).select('name');
        return res.status(200).json(users);
    } catch (err) {
        return res.status(400).json({
            error: 'Error in retrieving unfollowed users'
        });
    }
}

export default {
    create,
    list,
    userById,
    read,
    update,
    remove,
    updatePassword,
    photo,
    defaultPhoto,
    addFollower,
    addFollowing,
    removeFollower,
    removeFollowing,
    findPeople
};