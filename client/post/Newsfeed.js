import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import NewPost from './NewPost';
import PostList from './PostList';
import SnackAlert from '../user/SnackAlert';
import { listNewsFeed } from './api-post';
import auth from '../auth/auth-helper';

function Newsfeed() {

    const classes = useStyles();

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEndOfScroll, setIsEndOfScroll] = useState(false);

    const credentials = auth.isAuthenticated();

    const getPosts = signal => {

        console.log('newsfeed');

        const lastPost = posts[posts.length - 1];

        const lastPostId = lastPost ? lastPost._id : -1;

        listNewsFeed({ userId: credentials.user._id }, credentials, signal, lastPostId).then(data => {
            if (data && data.error) {
                setError(data.error);
            } else {
                if (data.length === 0) setIsEndOfScroll(true);
                setError('');
                setPosts(posts => [...posts, ...data]);
            }
        });

    }

    useEffect(() => {

        const abortController = new AbortController();
        const signal = abortController.signal;

        getPosts(signal);

        return () => abortController.abort();

    }, []);

    const addPost = post => {
        const updatedPosts = [...posts];
        updatedPosts.unshift(post); // Add elements to th beginning of array
        setPosts(updatedPosts);
    }

    const removePost = post => {
        const updatedPosts = [...posts];
        const index = updatedPosts.indexOf(post);
        updatedPosts.splice(index, 1);
        setPosts(updatedPosts);
    }

    return (
        <>
            <Paper elevation={0} className={classes.root}>
                <NewPost addPost={addPost} setError={setError} setSuccess={setSuccess} />
                <PostList
                    posts={posts}
                    removePost={removePost}
                    setError={setError}
                    setSuccess={setSuccess}
                    getPosts={getPosts}
                    isEndOfScroll={isEndOfScroll}
                />
            </Paper>
            <SnackAlert
                open={error !== ''}
                handleCloseSnack={() => setError('')}
                severity='error'
                message={error}
            />
            <SnackAlert
                open={success !== ''}
                handleCloseSnack={() => setSuccess('')}
                severity='success'
                message={success}
            />
        </>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    }
}));

export default Newsfeed;