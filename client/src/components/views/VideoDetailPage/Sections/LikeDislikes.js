import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip, Icon } from 'antd';

const LikeDislikes = (props) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikeAction, setDislikeAction] = useState(null);

  let variable = {};

  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userId };
  } else {
    variable = { commentId: props.commentId, userId: props.userId };
  }

  useEffect(() => {
    // get likes info
    axios.post('/api/like/getLikes', variable).then((response) => {
      if (response.data.success) {
        // get number of likes
        setLikes(response.data.likes.length);

        // check if I already clicked like button.
        response.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction('liked');
          }
        });
      } else {
        alert('Failed to get Likes information.');
      }
    });

    // get dislikes info
    axios.post('/api/like/getDislikes', variable).then((response) => {
      if (response.data.success) {
        // get number of likes
        setDislikes(response.data.dislikes.length);

        // check if I already clicked like button.
        response.data.dislikes.map((dislike) => {
          if (dislike.userId === props.userId) {
            setDislikeAction('disliked');
          }
        });
      } else {
        alert('Failed to get Dislikes information.');
      }
    });
  });

  const onLike = (e) => {
    // if user didn't click the like btn
    if (likeAction === null) {
      axios.post('/api/like/upLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(likes + 1);
          setLikeAction('liked');

          // if user already clicked the dislike btn
          if (dislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(dislikes - 1);
          }
        } else {
          console.log(response.data.err);
          alert('Failed to uplike');
        }
      });
      // if user already clicked the like btn
    } else {
      axios.post('/api/like/unLike', variable).then((response) => {
        if (response.data.success) {
          setLikes(likes - 1);
          setLikeAction(null);
        } else {
          console.log(response.data.err);
          alert('Failed to unlike');
        }
      });
    }
  };

  const onDislike = () => {
    // if user didn't click the dislike btn
    if (dislikeAction === null) {
      axios.post('/api/like/upDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setDislikeAction('disliked');

          // if user already clicked the like btn
          if (likeAction !== null) {
            setLikeAction(null);
            setLikes(likes - 1);
          }
        } else {
          console.log(response.data.err);
          alert('Failed to updislike');
        }
      });
      // if user already clicked the dislike btn
    } else {
      axios.post('/api/like/unDislike', variable).then((response) => {
        if (response.data.success) {
          setDislikes(dislikes - 1);
          setDislikeAction(null);
        } else {
          console.log(response.data.err);
          alert('Failed to undislike');
        }
      });
    }
  };
  return (
    <div>
      <span key="comment-basic-like" style={{ marginRight: '10px' }}>
        <Tooltip title="Like">
          <Icon
            type="like"
            theme={likeAction === 'liked' ? 'filled' : 'outlined'}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{likes}</span>
      </span>

      <span key="comment-basic-dislike" style={{ marginRight: '10px' }}>
        <Tooltip title="Dislike">
          <Icon
            type="dislike"
            theme={dislikeAction === 'disliked' ? 'filled' : 'outlined'}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikes}</span>
      </span>
    </div>
  );
};

export default LikeDislikes;
