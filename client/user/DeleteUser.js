import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';


import { Redirect } from 'react-router-dom';

import auth from '../auth/auth-helper';
import { remove } from './api-user';

function DeleteUser({ userId }) {

    const [open, setOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const openDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    const handleDelete = () => {
        const credentials = auth.isAuthenticated();

        remove({ userId: userId }, credentials).then(data => {
            if (data && data.error) {
                setError(data.error);
            } else {
                closeDialog();
                auth.clearJwt(() => setRedirect(true));
            }
        });
    }

    if (redirect) {
        return (<Redirect to='/' />);
    }

    return (
        <span>
            <IconButton aria-label='Edit' color='secondary' onClick={openDialog}>
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} fullWidth={true} onClose={closeDialog} maxWidth='xs'>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='primary' onClick={closeDialog}>Cancel</Button>
                    <Button color='secondary' onClick={handleDelete}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </span>
    )
}

DeleteUser.propTypes = {
    userId: PropTypes.string.isRequired
}

export default DeleteUser;