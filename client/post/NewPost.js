import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Avatar from '@material-ui/core/Avatar';
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { read } from '../user/api-user';
import { create } from './api-post';

function NewPost(props) {

    const classes = useStyles();

    const textRef = useRef();

    const [values, setValues] = useState({
        text: '',
        photo: null,
        error: '',
        name: ''
    });

    const [expanded, setExpanded] = useState(false);

    const credentials = auth.isAuthenticated();

    const handleChange = event => {
        const value = event.target.id === 'photo' ? event.target.files[0] : event.target.value;
        setValues({ ...values, [event.target.id]: value });
    }

    const photoUrl = `/api/users/photo/${credentials.user._id}?${new Date().getTime()}`;

    const clickPost = () => {
        const formData = new FormData();
        formData.append('text', values.text);
        formData.append('photo', values.photo);

        create({ userId: credentials.user._id }, credentials, formData).then(data => {
            if (data && data.error) {
                props.setError(data.error);
            } else {
                setValues({ ...values, text: '', photo: null });
                props.setSuccess('Post added!');
                props.setError('');
                props.addPost(data); // Add to posts array in NewsFeed
            }
        });
    }

    // Get updated username for the placeholder
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        read({ userId: credentials.user._id }, credentials, signal).then(data => {
            if (data && data.error) {
                props.setError(data.error);
            } else {
                setValues({ ...values, name: data.name });
                props.setError('');
            }
        });

        return () => {
            abortController.abort();
        }
    }, []);

    const cancelPhotoUpload = () => {
        setValues({ ...values, photo: null });
    }

    const handleClick = event => {
        if (textRef.current && textRef.current.contains(event.target)) {
            return;
        }
        setExpanded(false);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        }
    }, []);

    return (
        <Card ref={textRef} className={classes.root}>
            <CardHeader subheader='Create post' className={classes.cardHeader} />
            <CardContent>
                <Grid container>
                    <Grid item xs={1} className={classes.avatar}>
                        <Link to={`/users/${credentials.user._id}`}>
                            <Avatar src={photoUrl} />
                        </Link>
                    </Grid>
                    <Grid item xs={10} onClick={() => setExpanded(true)}>
                        <TextField
                            id='text'
                            multiline
                            rowsMax={6}
                            value={values.text}
                            onChange={handleChange}
                            placeholder={`What's on your mind, ${values.name}?`}
                            fullWidth
                            InputProps={{ disableUnderline: true }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            {expanded ? <Divider /> : null}
            <Collapse in={expanded} timeout='auto'>
                <CardActions>
                    <input id='photo' type='file' accept='image/*' style={{ display: 'None' }} onChange={handleChange} />
                    <label htmlFor='photo'>
                        <Button variant='contained' color='default' startIcon={<ImageIcon />} component='span'>
                            Image
                        </Button>
                    </label>
                    {
                        values.photo
                            ? <span>
                                {values.photo.name}
                                <IconButton color='secondary' onClick={cancelPhotoUpload}>
                                    <CancelIcon />
                                </IconButton>
                            </span>
                            : ''
                    }
                </CardActions>
                <CardActions>
                    <Button variant='contained' color='primary' disabled={values.text === '' && !values.photo} fullWidth onClick={clickPost}>
                        Post
                    </Button>
                </CardActions>
            </Collapse>
        </Card>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        margin: theme.spacing(0, 2)
    },
    avatar: {
        marginRight: theme.spacing(2.5),
    },
    cardHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
}));

NewPost.propTypes = {
    addPost: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired
}

export default NewPost;
