import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './core/Home';
import Users from './user/Users';
import Signup from './user/Signup';
import Signin from './auth/Signin';
import Profile from './user/Profile';
import PrivateRoute from './auth/PrivateRoute';
import EditProfile from './user/EditProfile';
import EditPassword from './user/EditPassword';
import Menu from './core/Menu';

const MainRouter = () => {

    return (
        <div>
            <Menu />
            <Switch>
                <PrivateRoute path='/users/:userId/edit-password' component={EditPassword} />
                <PrivateRoute path='/users/:userId/edit' component={EditProfile} />
                <PrivateRoute path='/users/:userId' component={Profile} />
                <Route path='/users' component={Users} />
                <Route path='/signup' component={Signup} />
                <Route path='/signin' component={Signin} />
                <Route exact path='/' component={Home} />
            </Switch>
        </div>
    )
}

export default MainRouter;