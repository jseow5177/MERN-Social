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
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Edit from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import SnackAlert from './SnackAlert';
import { Link } from 'react-router-dom';

import ProfileTabs from './ProfileTabs';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import auth from '../auth/auth-helper';
import { read } from './api-user';
import { listByUser } from '../post/api-post';

function Profile({ match }) {

    const classes = useStyles();

    const [values, setValues] = useState({
        user: {},
        error: '',
        following: false,
        open: false
    });

    const [posts, setPosts] = useState([]);

    const credentials = auth.isAuthenticated();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        read({ userId: match.params.userId }, credentials, signal).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error, open: true });
            } else {
                // some() returns true once a match is found
                const following = data.followers.some(follower => follower._id === credentials.user._id);
                setValues({ ...values, user: data, following: following, error: '', open: false });
                loadPosts(data._id); // Load posts by user
            }
        });

        return () => {
            abortController.abort();
        }
    }, [match.params.userId]);

    const loadPosts = userId => {
        listByUser({ userId: userId }, credentials).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error, open: true });
            } else {
                setPosts(data);
            }
        });
    }

    const clickFollowButton = callApi => {
        callApi({ userId: credentials.user._id }, credentials, values.user._id).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error, open: true });
            } else {
                setValues({ ...values, user: data, following: !values.following, error: '', open: false });
            }
        });
    }

    const handleCloseSnack = () => {
        setValues({ ...values, open: false, error: '' });
    }

    const removePost = post => {
        const updatedPosts = [...posts];
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    }

    // To ensure img element reloads after the photo is updated, add a time value to photo url to bypass browser's default image caching 
    const photoUrl = values.user._id ? `/api/users/photo/${values.user._id}?${new Date().getTime()}` : `/api/users/defaultPhoto`;

    return (
        <Grid container justify='center' className={classes.grid}>
            <Paper elevation={3} className={classes.root}>
                <Typography variant='h6' className={classes.title}>Profile</Typography>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar src={photoUrl} />
                        </ListItemAvatar>
                        <ListItemText primary={values.user.name} secondary={values.user.email} />
                        {
                            auth.isAuthenticated() && auth.isAuthenticated().user._id === values.user._id
                                ? (
                                    <ListItemSecondaryAction>
                                        <Link to={`/users/${values.user._id}/edit`}>
                                            <IconButton color="primary" aria-label="Edit">
                                                <Edit />
                                            </IconButton>
                                        </Link>
                                        <DeleteUser userId={values.user._id} setValues={setValues} />
                                    </ListItemSecondaryAction>
                                )
                                : (
                                    <FollowProfileButton following={values.following} onButtonClick={clickFollowButton} />
                                )
                        }
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary={values.user.about}
                            secondary={values.user.created ? `Joined: ${new Date(values.user.created).toDateString()}` : ''}
                        />
                    </ListItem>
                </List>
                <ProfileTabs
                    user={values.user}
                    posts={posts}
                    removePost={removePost}
                />
            </Paper>
            <SnackAlert open={values.open} message={values.error} handleCloseSnack={handleCloseSnack} severity='error' />
        </Grid>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        width: 800
    },
    title: {
        padding: theme.spacing(2),
        color: theme.palette.protectedTitle,
    },
    grid: {
        marginTop: theme.spacing(15)
    },
    error: {
        display: 'flex'
    }, errorIcon: {
        marginRight: theme.spacing(1)
    }
}));

export default Profile;