import User from '../models/user.model';
import extend from 'lodash/extend';
import errorHandler from '../helpers/dbErrorHandler'; // Helper to respond to route requests when error occurs

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
        const user = await User.findById(id);
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
    try {
        const user = req.profile;
        const updatedUser = extend(user, req.body); // req.body contains updated info of user
        updatedUser.updated = Date.now(); // To reflect the latest updated timestamp
        await updatedUser.save();
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.profile;
        await user.remove();
        return res.status(200).json({ message: 'User successfully removed' });
    } catch (err) {
        return res.status(500).json({
            error: 'Could not delete user'
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

export default { create, list, userById, read, update, remove, updatePassword };