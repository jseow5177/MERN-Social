import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import mernImg from './../assets/images/mern.jpg';

import auth from '../auth/auth-helper';
import FindPeople from '../user/FindPeople';
import NewsFeed from '../post/Newsfeed';

function Home() {

    const classes = useStyles();

    return (
        <div>
            {
                auth.isAuthenticated() ?
                    (
                        <div className={classes.root} >
                            <Grid container spacing={3}>
                                <Grid item xs={8}>
                                    <NewsFeed />
                                </Grid>
                                <Grid item xs={4}>
                                    <FindPeople />
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <Card className={classes.card}>
                            <CardMedia className={classes.media} image={mernImg} title='Mern Stack' />
                            <CardContent>
                                <Typography variant='body1' align='center' className={classes.title}>
                                    Welcome to MERN Social
                    </Typography>
                            </CardContent>
                        </Card>
                    )
            }
        </div>

    )
}

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0, 20),
        marginTop: theme.spacing(10)
    },
    card: {
        width: 400,
        margin: 'auto',
        marginTop: theme.spacing(13) // 8 * 13 px
    }, title: {
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 400
    }
}));

export default Home;
