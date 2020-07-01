import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';
import { Link } from 'react-router-dom';

import Comments from './Comments';
import auth from '../auth/auth-helper';
import { remove, like, unlike } from './api-post';

function Post({ post, removePost, setError, setSuccess }) {

    const classes = useStyles();

    const credentials = auth.isAuthenticated();

    const checkLike = likes => {
        const match = likes.indexOf(credentials.user._id) !== -1;
        return match;
    }

    const [values, setValues] = useState({
        likes: post.likes.length,
        liked: checkLike(post.likes),
        comments: post.comments,
    });

    const deletePost = () => {
        remove({ postId: post._id }, credentials).then(data => {
            if (data && data.error) {
                setError(data.error);
            } else {
                removePost(post);
                setSuccess('Post deleted!');
                setError('');
            }
        })
    }

    const clickLike = () => {
        const callApi = values.liked ? unlike : like; // Call like or unlike depending on whether the post is liked
        callApi({ userId: credentials.user._id }, credentials, post._id).then(data => {
            if (data && data.error) {
                setError(data.error);
            } else {
                setValues({ ...values, likes: data.likes.length, liked: !values.liked });
                setError('');
            }
        });
    }

    const updateComments = comments => {
        setValues({ ...values, comments: comments });
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Link to={`/users/${post.postedBy._id}`}>
                        <Avatar src={`/api/users/photo/${post.postedBy._id}`} />
                    </Link>
                }
                action={post.postedBy._id === credentials.user._id &&
                    <IconButton onClick={deletePost}>
                        <DeleteIcon />
                    </IconButton>
                }
                title={
                    <Link to={`/users/${post.postedBy._id}`}>
                        <Typography variant='body1' className={classes.nameLink}>
                            {post.postedBy.name}
                        </Typography>
                    </Link>
                }
                subheader={new Date(post.created.toString()).toDateString()}
                className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
                <Typography component='p' className={classes.text}>
                    {post.text}
                </Typography>
                {
                    post.photo && (
                        <div className={classes.photo}>
                            <img src={`/api/posts/photo/${post._id}`} className={classes.media} />
                        </div>
                    )
                }
            </CardContent>
            <CardActions>
                {
                    values.liked
                        ? (
                            <IconButton aria-label='like' color='secondary' onClick={clickLike}>
                                <FavoriteIcon />
                            </IconButton>
                        ) : (
                            <IconButton aria-label='unlike' color='secondary' onClick={clickLike}>
                                <FavoriteBorderIcon />
                            </IconButton>
                        )
                }
                <span>{values.likes}</span>
                <IconButton aria-label='comment' color='secondary'>
                    <CommentIcon />
                </IconButton>
                <span>{values.comments.length}</span>
            </CardActions>
            <Comments postId={post._id} comments={values.comments} updateComments={updateComments} setError={setError} />
        </Card>
    )
}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    removePost: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
}

const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(3, 0),
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    cardContent: {
        backgroundColor: '#FFF'
    },
    photo: {
        textAlign: 'center',
        padding: theme.spacing(1)
    },
    media: {
        height: 200
    },
    text: {
        margin: theme.spacing(1)
    },
    nameLink: {
        color: theme.palette.openTitle,
        fontWeight: 'bold',
    }
}))

export default Post;