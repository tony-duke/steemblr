import React, { Component } from "react";
import { hot } from "react-hot-loader";
import Post from ".././Components/Post/";
//import getTrendingPosts from '.././Functions/getTrendingPosts'
import Masonry from "react-masonry-css";
import Spinner from ".././Components/Spinner";
import { Waypoint } from "react-waypoint";

import styled from "styled-components";
//REDUX
import { connect } from "react-redux";
import { getUserFollowing } from ".././actions/steemActions";
import {
  postFollowingToState,
  postVoteToState,
  removeVoteFromState,
  removePostsFromState
} from "../actions/stateActions";
import getNewPosts from ".././actions/getNewPosts";
import getTrendingPosts from ".././actions/getTrendingPosts";
const Container = styled.div`
  box-sizing: border-box;
  padding-left: 7%;
  padding-right: 7%;
  margin-top: 6em;
  position: relative;
  @media (max-width: 1024px) {
    margin-top: 7em;
  }
  @media (max-width: 768px) {
    margin-top: 6em;
  }
  @media (max-width: 425px) {
    padding-left: 0;
    padding-right: 0;
    margin-top: 5.7em;
  }
  @media (max-width: 375px) {
  }
`;
const EndMessage = styled.div`
  text-align: center;
`;
class PostsLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingData: true,
      posts: [],
      shouldLoad: false,
      innerWidth: window.innerWidth,
      hasMorePosts: true
    };

    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.renderWaypoint = this.renderWaypoint.bind(this);
  }
  async loadMorePosts() {
    if (
      Object.keys(this.props.steemPosts.posts).length === 0 ||
      this.props.steemPosts.posts === undefined ||
      this.state.fetchingData === true
    ) {
      return void 0;
    } else if (this.state.fetchingData === false) {
      this.setState({
        fetchingData: true,
        posts: this.props.steemPosts.posts
      });
      const post = this.props.steemPosts.posts[
        this.props.steemPosts.posts.length - 1
      ];
      const query = {
        tag: "",
        start_permlink: post.permlink,
        timestamp: post.timestamp,
        start_author: post.author,
        category: this.props.match.params.category
      };
      //loading post by the category
      switch (this.props.match.params.category) {
        case "trending":
          await this.props.getTrendingPosts(query);
          break;
        default:
          await this.props.getNewPosts(query);
          break;
      }

      await this.setState({
        fetchingData: false
      });
      if (this.state.posts.length === this.props.steemPosts.posts.length) {
        this.setState({
          hasMorePosts: false
        });
      }
    }
  }
  updateDimensions() {
    this.setState({
      innerWidth: window.innerWidth
    });
  }
  async componentWillMount() {
    await this.props.removePostsFromState();
    const query = {
      tag: "",
      limit: 10,
      category: this.props.match.params.category
    };
    window.addEventListener("resize", this.updateDimensions);
    //loading post by the category
    switch (this.props.match.params.category) {
      case "trending":
        await this.props.getTrendingPosts(query);
        break;
      default:
        await this.props.getNewPosts(query);
        break;
    }

    await this.setState({
      posts: this.props.steemPosts.posts,
      fetchingData: false
    });
  }
  checkVoteStatus(props) {
    const find = this.props.steemProfileVotes.votes.find(
      o => o.permlink === props
    );
    if (find) {
      return {
        status: true,
        percent: find.percent
      };
    } else {
      return {
        status: false,
        percent: 0
      };
    }
  }
  renderWaypoint() {
    if (this.state.hasMorePosts) {
      return (
        <Waypoint onEnter={this.loadMorePosts} bottomOffset="-777px">
          <span style={{ width: "50px", height: "50px" }}>Loading...</span>
        </Waypoint>
      );
    } else {
      return <EndMessage>No more posts to load</EndMessage>;
    }
  }

  renderPosts() {
    const filtered = this.props.steemPosts.posts.filter(post => {
      return post.author !== undefined;
    });
    return filtered.map(post => {
      let width = "%";

      let fullPermlink = [post.root_author, post.root_permlink].join("/");
      return (
        <Post
          post={post}
          username={this.props.steemProfile.profile._id}
          isFollowing={this.props.following.users.includes(post.author)}
          key={post.id}
          voteStatus={this.checkVoteStatus(fullPermlink)}
          fullPermlink={fullPermlink}
          width={width}
          componentLocation="explore"
        />
      );
    });
  }
  render() {
    const breakpointColumnsObj = {
      default: 3,
      2570: 4,
      1440: 3,
      1368: 3,
      1024: 2,
      768: 2,
      425: 1
    };
    return (
      <Container>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {this.renderPosts()}
        </Masonry>
        {this.state.fetchingData ? <Spinner /> : this.renderWaypoint()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  steemProfile: state.steemProfile,
  following: state.following,
  steemProfileVotes: state.steemProfileVotes,
  steemPosts: state.steemPosts,
  postFollowingToState: state.postFollowingToState
});

export default connect(
  mapStateToProps,
  {
    getUserFollowing,
    getNewPosts,
    getTrendingPosts,
    removePostsFromState,
    postFollowingToState,
    postVoteToState,
    removeVoteFromState
  }
)(hot(module)(PostsLoader));
