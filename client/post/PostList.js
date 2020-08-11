import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroll-component";
import ContentLoader from 'react-content-loader';

import Typography from '@material-ui/core/Typography';

import Post from './Post';

function PostList(props) {

    const classes = useStyles();

    return (
        <InfiniteScroll
            dataLength={props.posts.length}
            next={() => {
                if (props.posts.length !== 0) {
                    setTimeout(() => props.getPosts(), 1000);
                }
            }}
            loader={
                <div style={{ marginTop: '2rem' }}>
                    <ContentLoader />
                </div>}
            hasMore={!props.isEndOfScroll}
            endMessage=''
            style={{ padding: '1rem' }}
        >
            {
                props.posts.map(post => {
                    return (
                        <Post post={post} key={post._id} removePost={props.removePost} setError={props.setError} setSuccess={props.setSuccess} />
                    )
                })
            }
        </InfiniteScroll>
    )
}

PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removePost: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    getPosts: PropTypes.func.isRequired,
    isEndOfScroll: PropTypes.bool.isRequired,
    userId: PropTypes.string,
}

const useStyles = makeStyles(theme => ({
    endOfPageText: {
        textAlign: 'center',
        width: '100%',
        color: theme.palette.openTitle
    }
}))

export default PostList;