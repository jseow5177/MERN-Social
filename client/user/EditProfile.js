import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import PublishIcon from '@material-ui/icons/Publish';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { read, update } from './api-user';


function EditProfile({ match }) {

    const classes = useStyles();

    const [values, setValues] = useState({
        name: '',
        email: '',
        about: '',
        photo: null,
        error: '',
        redirectToProfile: false
    });

    useEffect(() => {

        const abortController = new AbortController();
        const signal = abortController.signal;
        const credentials = auth.isAuthenticated();

        read({ userId: match.params.userId }, credentials, signal).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, name: data.name, email: data.email, about: data.about || '' });
            }
        });

    }, []);

    const photoUrl = match.params.userId ? `/api/users/photo/${match.params.userId}?${new Date().getTime()}` : `/api/users/defaultPhoto`;

    const clickSubmit = () => {

        // For file submission, need FormData encoded as multipart/form-data
        const userData = new FormData();
        userData.append('name', values.name);
        userData.append('email', values.email);
        userData.append('about', values.about);
        values.photo && userData.append('photo', values.photo);

        const credentials = auth.isAuthenticated();

        update({ userId: match.params.userId }, credentials, userData).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, redirectToProfile: true });
            }
        });

    }

    const handleChange = event => {
        const value = event.target.id === 'photo' ? event.target.files[0] : event.target.value
        setValues({ ...values, [event.target.id]: value });
    }

    if (values.redirectToProfile) {
        return (<Redirect to={`/users/${match.params.userId}`} />)
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Card className={classes.root} >
                <CardContent>
                    <Typography variant='h6' className={classes.title}>Edit Profile</Typography>
                    <input id='photo' onChange={handleChange} type='file' accept='image/*' style={{ display: 'None' }} />
                    <Avatar src={photoUrl} className={classes.large} />
                    <Grid container justify='center' alignItems='center' className={classes.uploadWrapper}>
                        <label htmlFor='photo'>
                            <Button variant='contained' color='default' component='span'>
                                <PublishIcon />Upload
                            </Button>
                        </label>
                        <span className={classes.filename}>{values.photo ? values.photo.name : ''}</span>
                    </Grid>
                    <TextField id='email' label='Email' value={values.email} onChange={handleChange} variant='outlined' margin='dense' type='email' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='name' label='Name' value={values.name} onChange={handleChange} variant='outlined' margin='dense' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='about' label='About' value={values.about} onChange={handleChange} variant='outlined' margin='dense' type='text' fullWidth={true} multiline rows={3} className={classes.textField} />
                    <Link to={`/users/${match.params.userId}/edit-password`} className={classes.textLink}>
                        Change password
                    </Link>
                    {
                        values.error &&
                        (<Typography component='p' color='error' className={classes.error}>
                            <Icon color='error' className={classes.errorIcon}>error</Icon>{values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary' onClick={clickSubmit} className={classes.submitBtn}>Save</Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        width: 400
    },
    grid: {
        height: 600
    },
    title: {
        padding: theme.spacing(2, 2),
        color: theme.palette.protectedTitle,
        textAlign: 'center'
    },
    textField: {
        marginBottom: theme.spacing(2)
    },
    submitBtn: {
        margin: theme.spacing(0, 'auto')
    },
    error: {
        display: 'flex',
        marginTop: theme.spacing(1)
    },
    errorIcon: {
        marginRight: theme.spacing(1)
    },
    textLink: {
        color: theme.palette.openTitle,
        textDecoration: 'None',
        '&:hover': {
            textDecoration: 'underline'
        }
    },
    uploadWrapper: {
        margin: theme.spacing(2, 0)
    },
    filename: {
        marginLeft: theme.spacing(1)
    },
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        margin: theme.spacing(0, 'auto')
    }
}));

export default EditProfile;