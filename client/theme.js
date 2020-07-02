// Customize the Material-UI theme
// Check here for the default theme: https://material-ui.com/customization/default-theme/?expand-path=$.palette.primary

import { createMuiTheme } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true // To migrate to typography v2
    },
    palette: {
        primary: {
            light: '#5c67a3',
            main: '#3f4771',
            dark: '#2e355b',
            contrastText: '#fff' // If component color is primary, the text will be white
        },
        secondary: {
            light: '#ff79b0',
            main: '#ff4081',
            dark: '#c60055',
            contrastText: '#000' // If component color is secondary, the text will be black
        },
        type: 'light',
        openTitle: '#3f4771',
        protectedTitle: pink['400'],
    }
});

export default theme;