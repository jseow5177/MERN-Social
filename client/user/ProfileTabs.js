import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import FollowGrid from './FollowGrid';
import PostList from '../post/PostList';

function ProfileTabs(props) {

    const [tab, setTab] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        if (props.user.followers) {
            setFollowerCount(props.user.followers.length)
        }
    }, [props.user.followers]);

    useEffect(() => {
        if (props.user.following) {
            setFollowingCount(props.user.following.length)
        }
    }, [props.user.following]);


    const handleTabChange = (e, newTab) => {
        setTab(newTab);
    }

    return (
        <div>
            <AppBar position='static' color='default'>
                <Tabs value={tab} onChange={handleTabChange} indicatorColor='primary' textColor='primary' variant='fullWidth'>
                    <Tab label='Post' />
                    <Tab label={followerCount > 0 ? `Followers (${followerCount})` : `Follower (${followerCount})`} />
                    <Tab label={`Following (${followingCount})`} />
                </ Tabs>
            </AppBar>
            {tab === 0 && <TabContainer><PostList posts={props.posts} removePost={props.removePost} setSuccess={props.setSuccess} setError={props.setError} /></TabContainer>}
            {tab === 1 && <TabContainer><FollowGrid people={props.user.followers} /></TabContainer>}
            {tab === 2 && <TabContainer><FollowGrid people={props.user.following} /></TabContainer>}
        </div>
    )
}

ProfileTabs.propTypes = {
    user: PropTypes.object.isRequired,
    posts: PropTypes.array.isRequired,
    removePost: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired
}

const TabContainer = props => {
    return (
        <Typography component='div'>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

export default ProfileTabs;