import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTitle from '@material-ui/core/GridListTile';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { Link } from 'react-router-dom';

function FollowGrid(props) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <GridList cellHeight={160} cols={4} className={classes.gridList}>
                {
                    props.people.map((person, index) => (
                        <GridListTitle style={{ 'height': 'auto' }} key={index}>
                            <Link to={`/users/${person._id}`}>
                                <Avatar src={`/api/users/photo/${person._id}`} className={classes.avatar}/>
                                <Typography className={classes.tileText}>
                                    {person.name}
                                </Typography>
                            </Link>
                        </GridListTitle>
                    ))
                }
            </GridList>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(2),
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
    },
    gridList: {
        width: 500,
        height: 'auto',
        paddingTop: theme.spacing(1)
    },
    avatar: {
        margin: theme.spacing(0, 'auto'),
        width: 60,
        height: 60
    },
    tileText: {
        textAlign: 'center',
        marginTop: theme.spacing(1)
    }
}));

FollowGrid.propTypes = {
    people: PropTypes.array.isRequired
}

export default FollowGrid;