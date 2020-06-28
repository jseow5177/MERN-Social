import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import SnackAlert from './SnackAlert';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { follow, findPeople } from './api-user';

function FindPeople() {

    const classes = useStyles();

    const [values, setValues] = useState({
        users: [],
        open: false,
        followMessage: '',
        credentials: ''
    });

    const [credentials, setCredentials] = useState('');

    useEffect(() => {

        const abortController = new AbortController();
        const signal = abortController.signal;

        const credentials = auth.isAuthenticated();
        setCredentials(credentials);

        findPeople({ userId: credentials.user._id }, credentials, signal).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, users: data });
            }
        });

    }, []);

    const clickFollow = (user, index) => {
        follow({ userId: credentials.user._id }, credentials, user._id).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                const toFollow = values.users; // Initial list of users that can be followed
                toFollow.splice(index, 1);
                setValues({ ...values, users: toFollow, open: true, followMessage: `Following ${user.name}` });
            }
        });
    }

    const handleCloseSnack = () => {
        setValues({ ...values, open: false });
    }

    return (
        <Paper elevation={1} className={classes.root}>
            <Typography color='primary' variant='h6' className={classes.title}>
                Who to follow
            </Typography>
            <Divider />
            <List>
                {
                    values.users.length !== 0
                        ? (
                            values.users.map((user, index) => (
                                <span key={index}>
                                    <ListItem alignItems='center'>
                                        <ListItemAvatar>
                                            <Avatar src={`/api/users/photo/${user._id}/`} />
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} />
                                        <ListItemSecondaryAction>
                                            <Link to={`/users/${user._id}/`}>
                                                <IconButton color='secondary'>
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Link>
                                            <Button variant='contained' color='primary' onClick={() => clickFollow(user, index)}>
                                                Follow
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </span>
                            ))
                        )
                        : (
                            <Typography color='primary' variant='body1' className={classes.title}>No recommendation</Typography>
                        )
                }
            </List>
            <SnackAlert open={values.open} message={values.followMessage} handleCloseSnack={handleCloseSnack} severity='success' />
        </Paper>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    title: {
        paddingLeft: theme.spacing(2)
    }
}));

export default FindPeople;