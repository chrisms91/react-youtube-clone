import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, List, Avatar } from 'antd';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

const VideoDetailPage = (props) => {
  const videoId = props.match.params.videoId;
  const [videoDetail, setVideoDetail] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // get detail information of the video
    axios
      .get('/api/video/getVideoDetail', {
        params: {
          videoId: videoId,
        },
      })
      .then((response) => {
        if (response.data.success) {
          setVideoDetail(response.data.videoDetail);
        } else {
          alert('Failed to get video details.');
        }
      });

    // get comments under the video
    axios
      .get('/api/comment/getComments', { params: { postId: videoId } })
      .then((response) => {
        if (response.data.success) {
          console.log('getCOmments');
          console.log(response.data.comments);
          setComments(response.data.comments);
        } else {
          alert('Failed to get comments data.');
        }
      });
  }, []);

  const refreshComments = (newComment) => {
    setComments(comments.concat(newComment));
  };

  if (videoDetail.writer) {
    const subscribeBtn = videoDetail.writer._id !==
      localStorage.getItem('userId') && (
      <Subscribe
        userTo={videoDetail.writer._id}
        userFrom={localStorage.getItem('userId')}
      />
    );
    return (
      <Row gutter={[16, 16]}>
        {' '}
        {/* Video Player */}{' '}
        <Col lg={18} xs={24}>
          <div
            style={{
              width: '100%',
              padding: '3rem 4rem',
            }}
          >
            <video
              style={{
                width: '100%',
              }}
              src={`http://localhost:5000/${videoDetail.filePath}`}
              controls
            />
            <List.Item style={{ display: 'flex' }} actions={[subscribeBtn]}>
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />{' '}
            </List.Item>
            {/* Comments */}
            <Comment
              refreshComments={refreshComments}
              commentLists={comments}
            />
          </div>{' '}
        </Col>{' '}
        {/* Side Video List */}{' '}
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>{' '}
      </Row>
    );
  } else {
    return <div> Loading... </div>;
  }
};

export default VideoDetailPage;
