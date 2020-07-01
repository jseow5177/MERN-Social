import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import { Link } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { comment, uncomment } from './api-post';

function Comments({ postId, comments, updateComments, setError }) {

    const classes = useStyles();

    const [text, setText] = useState('');

    const handleChange = event => {
        setText(event.target.value);
    }

    const credentials = auth.isAuthenticated();

    const addComment = event => {
        if (event.keyCode === 13 && comment) {
            event.preventDefault();
            comment({ userId: credentials.user._id }, credentials, postId, text).then(data => {
                if (data && data.error) {
                    setError(data.error);
                } else {
                    setText('');
                    setError('');
                    updateComments(data.comments);
                }
            });
        }
    }

    const removeComment = comment => {
        uncomment({ userId: credentials.user._id }, credentials, postId, comment).then(data => {
            if (data && data.error) {
                setError(data.error);
            } else {
                setError('');
                updateComments(data.comments);
            }
        });
    }

    const commentBody = comment => {
        return <Grid container className={classes.commentBody} key={comment._id}>
            <Grid item xs={1} className={classes.avatar}>
                <Link to={`/users/${comment.postedBy._id}`}>
                    <Avatar src={`/api/users/photo/${comment.postedBy._id}`} />
                </Link>
            </Grid>
            <Grid item xs={11} className={classes.textBody}>
                <div>
                    <span>
                        <Link to={`/users/${comment.postedBy._id}`} className={classes.nameLink}>
                            {comment.postedBy.name}
                        </Link>
                        {` ${comment.text}`}
                    </span>
                </div>
                <span className={classes.commentDate}>
                    {new Date(comment.created).toDateString()}
                    {
                        credentials.user._id === comment.postedBy._id &&
                        <Icon className={classes.commentDelete} onClick={() => removeComment(comment)}>
                            delete
                        </Icon>
                    }
                </span>
            </Grid>
        </Grid>
    }

    return (
        <Card>
            <CardContent>
                {
                    comments.map(comment => {
                        return commentBody(comment);
                    })
                }
                <Grid container className={classes.commentInput}>
                    <Grid item xs={1} className={classes.avatar}>
                        <Link to={`/users/${credentials.user._id}`}>
                            <Avatar src={`/api/users/photo/${credentials.user._id}`} />
                        </Link>
                    </Grid>
                    <Grid item xs={11}>
                        <TextField
                            onKeyDown={addComment}
                            multiline
                            rowsMax={6}
                            value={text}
                            onChange={handleChange}
                            placeholder={`Write something...`}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

Comments.propTypes = {
    postId: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    updateComments: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
}

const useStyles = makeStyles(theme => ({
    avatar: {
        marginRight: theme.spacing(0),
    },
    commentBody: {
        marginTop: theme.spacing(2),
    },
    commentInput: {
        marginTop: theme.spacing(2)
    },
    textBody: {
        backgroundColor: '#DFE3EE',
        padding: theme.spacing(0.8),
        borderRadius: '5px'
    },
    nameLink: {
        color: theme.palette.openTitle,
        fontWeight: 'bold',
    },
    commentDate: {
        display: 'block',
        color: 'gray',
        fontSize: '0.8em',
        marginTop: theme.spacing(1),
    },
    commentDelete: {
        fontSize: '1rem',
        verticalAlign: 'middle',
        marginLeft: theme.spacing(1),
        cursor: 'pointer'
    }
}));

export default Comments;