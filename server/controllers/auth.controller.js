import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt'; // Express middleware for validating JWTs through the jsonwebtoken module
import config from './../../config/config';

const signin = async (req, res, next) => {
    try {

        if (!req.body.email) {
            return res.status(401).json({ error: 'Email is required' });
        }

        if (!req.body.password) {
            return res.status(401).json({ error: 'Password is required' });
        }

        const user = await User.findOne({ 'email': req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Check user password
        const isAuthenticated = await user.authenticate(req.body.password);
        if (!isAuthenticated) {
            return res.status(401).json({ error: 'Email and password do not match.' });
        }

        // Generate signed JWT using the secret key on the user's id
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);

        // Create cookie with the token in it
        res.cookie('token', token, { expire: new Date() + 10000 });

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: 'Could not sign in' });
    }
}

const signout = (req, res, next) => {
    res.clearCookie('token'); // Remove cookie that contains the token
    return res.status(200).json({ message: 'Signed out' });
}

// Checks authentication by decoding JWT token
// Decoded JWT payload is available in req.user
const requireSignin = expressJwt({ secret: config.jwtSecret });

// Checks authorization
// User can only delete or edit his / her own profile
const hasAuthorization = (req, res, next) => {
    // req.profile is populated by userById is userController
    // req.user is population by requireSignin in authController
    const authorized = req.profile && req.user && req.profile._id.toString() === req.user._id;
    if (!authorized) {
        return res.status(403).json({ error: 'You are not supposed to be here' });
    }
    next();
}

export default { signin, signout, requireSignin, hasAuthorization };