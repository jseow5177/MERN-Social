import React from 'react';
import MainRouter from './MainRouter'; // The main component that houses all other components
import { BrowserRouter } from 'react-router-dom'; // Enables frontend routing
import { ThemeProvider } from '@material-ui/styles'; // To inject custom theme into application
import { hot } from 'react-hot-loader'; // Allows React components to be live reloaded without the loss of state

import theme from './theme';

const App = () => {

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <MainRouter />
            </ThemeProvider>
        </BrowserRouter>
    )
}

export default hot(module)(App);