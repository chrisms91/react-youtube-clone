import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const Comment = (props) => {
  const userData = useSelector((state) => state.user.userData); // get user information from redux store
  const [commentValue, setCommentValue] = useState('');
  const { videoId } = useParams();

  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: userData._id,
      postId: videoId,
    };
    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue('');
        props.refreshComments(response.data.result);
      } else {
        console.log(response.data.err);
        alert('Failed to save comment.');
      }
    });
  };

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map(
          (comment, index) =>
            !comment.responseTo && (
              <>
                <SingleComment
                  refreshComments={props.refreshComments}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  postId={videoId}
                  parentCommentId={comment._id}
                  commentLists={props.commentLists}
                  refreshComments={props.refreshComments}
                />
              </>
            )
        )}

      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleClick}
          value={commentValue}
          placeholder="Write comments here..."
        />
        <br />
        <button style={{ width: '20%', height: '52px' }} onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Comment;
