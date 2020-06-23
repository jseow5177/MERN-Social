import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

function SnackAlert(props) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={props.open}
            onClose={props.handleCloseSnack}
            autoHideDuration={5000}
        >
            <Alert onClose={props.handleCloseSnack} severity={props.severity}>
                {props.message}
            </Alert>
        </Snackbar>
    )
}

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default SnackAlert;