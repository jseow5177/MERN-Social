import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';

import auth from '../auth/auth-helper';

const Menu = withRouter(({ history }) => {

    const classes = useStyles();

    const isActive = (history, path) => {
        if (history.location.pathname === path) {
            return { color: '#FF4081' }
        } else {
            return { color: '#FFF' }
        }
    }

    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6' color='inherit'>
                    MERN Social
            </Typography>
                <Link to='/'>
                    <IconButton aria-label='Home' style={isActive(history, '/')}>
                        <HomeIcon />
                    </IconButton>
                </Link>
                <Link to='/users' className={classes.buttonLink}>
                    <Button style={isActive(history, '/users')}>Users</Button>
                </Link>
                {
                    !auth.isAuthenticated() &&
                    (
                        <span>
                            <Link to='/signup' className={classes.buttonLink}>
                                <Button style={isActive(history, '/signup')}>Sign up</Button>
                            </Link>
                            <Link to='/signin' className={classes.buttonLink}>
                                <Button style={isActive(history, '/signin')}>Sign in</Button>
                            </Link>
                        </span>
                    )
                }
                {
                    auth.isAuthenticated() &&
                    (
                        <span>
                            <Link to={`/users/${auth.isAuthenticated().user._id}`} className={classes.buttonLink}>
                                <Button style={isActive(history, `/users/${auth.isAuthenticated().user._id}`)}>My Profile</Button>
                            </Link>
                            <Button color='inherit' onClick={() => auth.clearJwt(() => history.push('/'))}>Sign out</Button>
                        </span>
                    )
                }
            </Toolbar>
        </AppBar>
    )
});

const useStyles = makeStyles(theme => ({
    buttonLink: {
        textDecoration: 'None'
    }
}));

export default Menu;
