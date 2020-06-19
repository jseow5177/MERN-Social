import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { Redirect } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { updatePassword } from './api-user';


function EditPassword({ match }) {

    const classes = useStyles();

    const [values, setValues] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        redirectToProfile: false
    });

    const clickSubmit = () => {

        const credentials = auth.isAuthenticated();

        const passwords = {
            oldPassword: values.oldPassword || undefined,
            newPassword: values.newPassword || undefined,
            confirmPassword: values.confirmPassword || undefined
        }

        updatePassword({ userId: match.params.userId }, credentials, passwords).then(data => {
            if (data && data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({ ...values, error: '', redirectToProfile: true });
            }
        });

    }

    const handleChange = event => {
        setValues({ ...values, [event.target.id]: event.target.value })
    }

    if (values.redirectToProfile) {
        return (<Redirect to={`/users/${match.params.userId}`} />)
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.grid}>
            <Card className={classes.root} >
                <CardContent>
                    <Typography variant='h6' className={classes.title}>Change Password</Typography>
                    <TextField id='oldPassword' label='Old Password' value={values.oldPassword} onChange={handleChange} variant='outlined' margin='dense' type='password' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='newPassword' label='New Password' value={values.newPassword} onChange={handleChange} variant='outlined' margin='dense' type='password' fullWidth={true} className={classes.textField} />
                    <br />
                    <TextField id='confirmPassword' label='Confirm New Password' value={values.confirmPassword} onChange={handleChange} variant='outlined' margin='dense' type='password' fullWidth={true} className={classes.textField} />
                    {
                        values.error &&
                        (<Typography component='p' color='error' className={classes.error}>
                            <Icon color='error' className={classes.errorIcon}>error</Icon>{values.error}
                        </Typography>)
                    }
                </CardContent>
                <CardActions>
                    <Button variant='contained' color='primary' onClick={clickSubmit} className={classes.submitBtn}>Change Password</Button>
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
        color: theme.palette.protectedTitle,
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

export default EditPassword;