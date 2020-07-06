import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon'

import { signin } from './api-auth';
import auth from './auth-helper';
import { Redirect } from 'react-router-dom';

function Signin(props) {

    const classes = useStyles();

    const [values, setValues] = useState({
        password: '',
        email: '',
        error: '',
        redirectToReferrer: false // Helps in redirection
    });

    const handleChange = event => {
        setValues({ ...values, [event.target.id]: event.target.value });
    }

    const clickSubmit = () => {
        const user = {
            password: values.password || undefined,
            email: values.email || undefined
        }
        signin(user).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                // Add JWT to localStorage
                auth.authenticate(data, () => {
                    setValues({ ...values, error: '', redirectToReferrer: true });
                })
            }
        })
    }

    useEffect(() => {
        const jwt = auth.isAuthenticated();
        if (jwt) {
            setValues({ ...values, redirectToReferrer: true });
        }
    }, []);

    // Redirect when signed in
    if (values.redirectToReferrer) {
        const { from } = props.location.state ? props.location.state : {from: '/'};
        return <Redirect to={from} />
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Card className={classes.root} >
                <CardContent>
                    <Typography variant='h6' className={classes.title}>Sign in</Typography>
                    <TextField id='email' label='Email' value={values.email} onChange={handleChange} variant='outlined' margin='dense' type='email' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='password' label='Password' value={values.password} onChange={handleChange} variant='outlined' margin='dense' type='password' fullWidth={true} className={classes.textField} />
                    <br />
                    {
                        values.error &&
                        (<Typography component='p' color='error' className={classes.error}>
                            <Icon color='error' className={classes.errorIcon}>error</Icon>{values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary' onClick={clickSubmit} className={classes.submitBtn}>Submit</Button>
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
        color: theme.palette.openTitle,
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
    },
    errorIcon: {
        marginRight: theme.spacing(1)
    },
    dialog: {
        width: 300
    }
}));

export default Signin;