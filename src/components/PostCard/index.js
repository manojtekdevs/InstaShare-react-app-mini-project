import {Component} from 'react'

import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import './index.css'

const commenterInitialBgColors = [
  'span-bg1',
  'span-bg2',
  'span-bg3',
  'span-bg4',
  'span-bg5',
  'span-bg6',
  'span-bg7',
]

class PostCard extends Component {
  state = {
    isLiked: false,
    likedStatus: false,
    counter: 0,
  }

  renderPostLikeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {postDetails} = this.props
    const {postId} = postDetails

    const {likedStatus} = this.state
    console.log(likedStatus)

    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify({like_status: likedStatus}),
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
    }
  }

  onClickLikeIncreaseButton = () => {
    this.setState({isLiked: true})
    this.setState(prevState => ({counter: prevState.counter + 1}))
    this.setState({likedStatus: true}, this.renderPostLikeStatus)
  }

  onClickLikeDecreaseButton = () => {
    this.setState({isLiked: false})
    this.setState(prevState => ({counter: prevState.counter - 1}))
    this.setState({likedStatus: false}, this.renderPostLikeStatus)
  }

  render() {
    const {postDetails} = this.props
    const {
      createdAt,
      likeCount,
      userName,
      profilePic,
      caption,
      userId,
      imageUrl,
      comment,
    } = postDetails

    const {isLiked} = this.state

    const {counter} = this.state
    const updateCount = likeCount + counter

    return (
      <li className="post-card-list-item" data-testid="postCard">
        <Link to={`/users/${userId}`} className="link">
          <div className="profile-username-container">
            <img
              src={profilePic}
              alt="post author profile"
              className="profile-pic"
            />
            <h1 className="post-username">{userName}</h1>
          </div>
        </Link>
        <img src={imageUrl} alt="post" className="postImage" />
        <div className="desktop-styling-posts">
          <div className="reactions-container">
            {isLiked ? (
              <button
                type="button"
                className="like-button"
                onClick={this.onClickLikeDecreaseButton}
                data-testid="unLikeIcon"
              >
                <FcLike className="liked-icon like-icon" aria-label="close" />
              </button>
            ) : (
              <button
                type="button"
                className="like-button"
                onClick={this.onClickLikeIncreaseButton}
                data-testid="likeIcon"
              >
                <BsHeart className="like-icon" aria-label="close" />
              </button>
            )}
            <FaRegComment className="comment-icon" />
            <BiShareAlt className="share-icon" />
          </div>
          <div className="text-container">
            <p className="likes">{updateCount} likes</p>
            <p className="caption">{caption}</p>
            <ul>
              {comment.map(eachItem => (
                <li key={eachItem.user_id} className="comments-container">
                  <p className="comment">
                    <Link to={`/users/${eachItem.user_id}`} className="link">
                      <span
                        className={`commenter-initial-span ${
                          commenterInitialBgColors[Math.ceil(Math.random() * 6)]
                        }`}
                      >
                        {eachItem.user_name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="span">{eachItem.user_name}</span>
                    </Link>
                    {eachItem.comment}
                  </p>
                </li>
              ))}
            </ul>
            <p className="created">{createdAt}</p>
          </div>
        </div>
      </li>
    )
  }
}
export default PostCard
