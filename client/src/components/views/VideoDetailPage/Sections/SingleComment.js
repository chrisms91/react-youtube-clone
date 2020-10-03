import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

const SingleComment = (props) => {
  const userData = useSelector((state) => state.user.userData);
  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const onClickReplyOpen = () => {
    setOpenReply(!openReply);
  };

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: userData._id,
      postId: props.postId,
      responseTo: props.comment._id,
    };

    axios.post('/api/comment/saveComment', variables).then((response) => {
      if (response.data.success) {
        setCommentValue('');
        setOpenReply(false);
        props.refreshComments(response.data.result);
      } else {
        console.log(response.data.err);
        alert('Failed to save comment.');
      }
    });
  };

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="comment" />}
        content={props.comment.content}
      />

      {openReply && (
        <form style={{ display: 'flex' }} onSubmit={onSubmit}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onHandleChange}
            value={commentValue}
            placeholder="Write comments here..."
          />
          <br />
          <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default SingleComment;
