import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SideVideo = () => {
  const [sideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get('/api/video/getVideos').then((response) => {
      if (response.data.success) {
        // success
        setSideVideos(response.data.videos);
      } else {
        // err
        alert('Fetching side vidoes error');
      }
    });
  }, []);

  const renderSideVideo = sideVideos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }}
      >
        <div style={{ width: '40%', marginRight: '1rem' }}>
          <a href="#">
            <img
              style={{ width: '100%' }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            />
          </a>
        </div>

        <div style={{ width: '50%', height: '100%' }}>
          <a href="" style={{ color: 'gray' }}>
            <span style={{ fontSize: '1rem', color: 'black' }}>
              {video.title}
            </span>
            <br />
            <span>{video.writer.name}</span>
            <br />
            <span>{video.views} views</span>
            <br />
            <span>
              {minutes} : {seconds}
            </span>
            <br />
          </a>
        </div>
      </div>
    );
  });

  return (
    <>
      <div style={{ marginTop: '3rem' }} />
      {renderSideVideo}
    </>
  );
};

export default SideVideo;
