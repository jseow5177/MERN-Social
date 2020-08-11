import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth-helper';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            // state stores information about where the redirection comes from
            auth.isAuthenticated() ? (<Component {...props} />) : (<Redirect to={{ pathname: '/signin', state: { from: props.location } }} />)
        )} />
    )
}

export default PrivateRoute;