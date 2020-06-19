import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

import DeleteUser from './DeleteUser';
import auth from '../auth/auth-helper';
import { read } from './api-user';

function Profile({ match }) {

    const classes = useStyles();

    const [user, setUser] = useState({});

    const [values, setValues] = useState({
        user: {},
        error: ''
    });

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        const credentials = auth.isAuthenticated();
        read({ userId: match.params.userId }, credentials, signal).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, user: data });
            }
        });

        return () => {
            abortController.abort();
        }
    }, [match.params.userId]);

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Paper elevation={3} className={classes.root}>
                <Typography variant='h6' className={classes.title}>Profile</Typography>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={values.user.name} secondary={values.user.email} />
                        {
                            auth.isAuthenticated() && auth.isAuthenticated().user._id === values.user._id &&
                            (
                                <ListItemSecondaryAction>
                                    <Link to={`/users/${values.user._id}/edit`}>
                                        <IconButton color="primary" aria-label="Edit">
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                    <DeleteUser userId={values.user._id} />
                                </ListItemSecondaryAction>
                            )
                        }
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={values.user.created ? `Joined: ${new Date(values.user.created).toDateString()}` : ''} />
                    </ListItem>
                    <ListItem>
                        {
                            values.error &&
                            (<Typography component='p' color='error' className={classes.error}>
                                <Icon color='error' className={classes.errorIcon}>error</Icon>{values.error}
                            </Typography>)
                        }
                    </ListItem>
                </List>
            </Paper>
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        width: 400
    },
    title: {
        padding: theme.spacing(2, 2),
        color: theme.palette.protectedTitle,
    },
    grid: {
        height: 600
    },
    error: {
        display: 'flex'
    }, errorIcon: {
        marginRight: theme.spacing(1)
    }
}));

export default Profile;