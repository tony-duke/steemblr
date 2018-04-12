import React, { Component } from 'react'

import styled from 'styled-components'
import { Blockquote, Box, Card, BackgroundImage, Subhead, Flex, Heading, Banner } from 'rebass'

import { Link } from 'react-router-dom'

import api from '.././Api'
import followSteem from '.././Functions/followSteem'


const StyledDiv = styled.div`
    background-color: white;
    width: 25vw
    margin-bottom: 10px;
    padding: 0px !important;
    border-radius: 1%;
    
  `
const Button = styled.button`
    border-radius: 1%;
`
const StyledCard = Card.extend`
`
export default class Post extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isFollowing: this.props.isFollowing
    }
    this.handleClick = this.handleClick.bind(this)
  }

  async handleClick() {
    console.log(this.props.username)
    followSteem(this.props.username, this.props.post.author)
    this.setState({
      isFollowing: true
    })
    setTimeout(this.props.updateFollowingState49
      , 5000);

  }

  render() {
    return (
    <StyledDiv>
      <StyledCard p={0} >
        {this.props.post.author}
        {this.state.isFollowing ? '' :
          <button onClick={this.handleClick}>
        Follow</button>}
         
        <Banner
          color='white'
          bg='gray8'
          backgroundImage='https://78.media.tumblr.com/604ed3aaef4bb815dadc13dff8fede93/tumblr_oxw13gOF8g1vxwt7xo1_500.gif'>
          <Heading
            f={[4, 5, 6, 7]}>
            {this.props.post.author}
          </Heading>
        </Banner>
  
        <Subhead  textAlign='left'>
          {this.props.post.author}
        </Subhead>
        <Blockquote>
          {this.props.post.title}
        </Blockquote>
      </StyledCard>
    </StyledDiv>
    )
  }
}

