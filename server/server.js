import mongoose from 'mongoose';

import config from './../config/config';
import app from './express';

mongoose.connect(config.mongoUri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log(`Successfully connected to database at ${config.mongoUri}`))
    .catch(err => `Unable to connect to database at ${config.mongoUri}: ${err}`);

app.listen(config.port, err => {
    if (err) console.log(err);
    else console.info(`Server is listening at port ${config.port}`);
});