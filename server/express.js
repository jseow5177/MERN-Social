import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression'; // Attempt to compress response bodies
import cors from 'cors'; // Enable cross-origin resource sharing
import helmet from 'helmet';
import path from 'path';

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';

import devBundle from './devBundle';
import Template from './../template';

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

// Should be commented out when building for production
devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use('/', userRoutes);
app.use('/', authRoutes);
app.use('/', postRoutes);

app.get('*', (req, res, next) => {

    return res.status(200).send(Template());

});

// Handle errors thrown by express-jwt
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // Error thrown when a token cannot be validated
        return res.status(401).json({ error: `${err.name}: ${err.message}` });
    } else {
        console.log(err);
        return res.status(500).json({ error: `${err.name}: ${err.message}` });
    }
})


export default app;