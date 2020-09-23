import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, List, Avatar } from 'antd';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

const VideoDetailPage = (props) => {
  const videoId = props.match.params.videoId;
  const [videoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios
      .get('/api/video/getVideoDetail', {
        params: {
          videoId: videoId,
        },
      })
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setVideoDetail(response.data.videoDetail);
        } else {
          alert('Failed to get video details.');
        }
      });
  }, []);

  if (videoDetail.writer) {
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
            <List.Item
              style={{ display: 'flex' }}
              actions={[
                <Subscribe
                  userTo={videoDetail.writer._id}
                  userFrom={localStorage.getItem('userId')}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={videoDetail.writer.image} />}
                title={videoDetail.writer.name}
                description={videoDetail.description}
              />{' '}
            </List.Item>
            {/* Comments */}{' '}
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
