import React, { useState, useEffect } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = (props) => {
  const [childCommentNumber, setChildCommentNumber] = useState(0);
  const [openReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;
    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]);

  const onHandleClick = (e) => {
    setOpenReplyComments(!openReplyComments);
  };

  const renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment
              refreshComments={props.refreshComments}
              comment={comment}
              postId={props.postId}
            />
            <ReplyComment
              refreshComments={props.refreshComments}
              postId={props.postId}
              parentCommentId={comment._id}
              commentLists={props.commentLists}
            />
          </div>
        )}
      </>
    ));

  return (
    <div style={{ width: '80%', marginLeft: '40px' }}>
      {childCommentNumber > 0 && (
        <p
          style={{ fontSize: '14px', margin: 0, color: 'gray' }}
          onClick={onHandleClick}
        >
          View {childCommentNumber} more comment(s)
        </p>
      )}

      {openReplyComments && renderReplyComment(props.parentCommentId)}
    </div>
  );
};

export default ReplyComment;
