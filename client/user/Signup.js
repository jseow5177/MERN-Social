import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';

import { create } from './api-user';

function Signup() {

    const classes = useStyles();

    const [values, setValues] = useState({
        name: '',
        password: '',
        email: '',
        open: false, // dialog open message
        error: ''
    });

    const handleChange = event => {
        setValues({ ...values, [event.target.id]: event.target.value });
    }

    const clickSubmit = () => {
        const user = {
            name: values.name || undefined,
            password: values.password || undefined,
            email: values.email || undefined
        }
        create(user).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', open: true });
            }
        })
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Card className={classes.root} >
                <CardContent>
                    <Typography variant='h6' className={classes.title}>Sign up</Typography>
                    <TextField id='email' label='Email' value={values.email} onChange={handleChange} variant='outlined' margin='dense' type='email' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='name' label='Name' value={values.name} onChange={handleChange} variant='outlined' margin='dense' fullWidth={true} className={classes.textField} />
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
            <Dialog open={values.open} disableBackdropClick={true} disableEscapeKeyDown={true} fullWidth={true} maxWidth='xs'>
                <DialogTitle>New Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        New account successully created.
                        </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button href='/signin' color='primary' variant='contained'>Sign in</Button>
                </DialogActions>
            </Dialog>
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
    }
}));

export default Signup;