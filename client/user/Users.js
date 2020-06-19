import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Link } from 'react-router-dom';

import { list } from './api-user';

function Users() {

    const classes = useStyles();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        list(signal).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                setUsers(data);
            }
        })

        return () => {
            abortController.abort(); // Abort GET request when component is unmounted before request is received
        }
    }, []);

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Paper elevation={3} className={classes.root}>
                <Typography variant='h6' className={classes.title}>All Users</Typography>
                <List>
                    {
                        users.map((user, i) => {
                            return (
                                <Link to={`/users/${user._id}`} key={i} className={classes.link}>
                                    <ListItem button>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={user.name} />
                                        <ListItemSecondaryAction>
                                            <IconButton>
                                                <ArrowForwardIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Link>
                            )
                        })
                    }
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
    grid: {
        height: 600
    },
    title: {
        padding: theme.spacing(2, 2),
        color: theme.palette.openTitle,
    },
    link: {
        textDecoration: 'None',
        color: '#2e355b'
    }
}));

export default Users;