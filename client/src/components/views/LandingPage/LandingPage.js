import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaCode } from 'react-icons/fa';
import { Row, Col, Typography, Card, Avatar } from 'antd';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get('/api/video/getVideos').then((response) => {
      if (response.data.success) {
        // success
        setVideos(response.data.videos);
      } else {
        // err
        alert('Fetching vidoes error');
      }
    });
  }, []);

  const renderCards = videos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={video._id} lg={6} md={8} xs={24}>
        <a href={`/video/post/${video._id}`}>
          <div style={{ position: 'relative' }}>
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </a>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image} />}
          title={video.title}
        />
        <span>{video.writer.name} </span>
        <br />
        <span style={{ marginLeft: '3rem' }}> {video.views} views </span>-{' '}
        <span> {moment(video.createdAt).format('MMM Do YY')} </span>
      </Col>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}>Recommended</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default LandingPage;
