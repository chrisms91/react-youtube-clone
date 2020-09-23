import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Form, Input, Icon, message } from 'antd';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography;

const privateOptions = [
  { value: 0, label: 'Private' },
  { value: 1, label: 'Public' },
];

const categoryOptions = [
  { value: 0, label: 'Film & Animation' },
  { value: 1, label: 'Autos & Vehicles' },
  { value: 2, label: 'Music' },
  { value: 3, label: 'Pets & Animals' },
];

const VideoUploadPage = (props) => {
  const user = useSelector((state) => state.user.userData); // from redux state store
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(0);
  const [category, setCategory] = useState('Film & Animation');
  const [filePath, setFilePath] = useState('');
  const [fileDuration, setFileDuration] = useState('');
  const [thumbnailPath, setThumbnailPath] = useState('');

  const onVideoTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onVideoDescriptionChange = (e) => {
    setVideoDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setIsPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);
    console.log(files);
    axios.post('/api/video/uploadfiles', formData, config).then((response) => {
      if (response.data.success) {
        // uploading video success
        console.log(response.data);

        const variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };

        setFilePath(response.data.url);

        axios.post('/api/video/thumbnail', variable).then((response) => {
          if (response.data.success) {
            // generating thumbnail success
            console.log(response.data);

            setThumbnailPath(response.data.url);
            setFileDuration(response.data.fileDuration);
          } else {
            alert('Generating Thumbnail is failed.');
          }
        });
      } else {
        alert('Uploading video is failed.');
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // grab userdata from redux store
    const variables = {
      writer: user._id,
      title: videoTitle,
      description: videoDescription,
      privacy: isPrivate,
      category: category,
      filePath: filePath,
      duration: fileDuration,
      thumbnail: thumbnailPath,
    };

    axios.post('/api/video/uploadvideo', variables).then((response) => {
      if (response.data.success) {
        //success upload
        message.success('Video is uploded successfully.');
        setTimeout(() => {
          props.history.push('/');
        }, 3000);
      } else {
        alert('Failed uploading video.');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>Upload Video</Title>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Drop zone */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: '300px',
                  height: '240px',
                  border: '1px solid lightgray',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: '3rem' }} />
              </div>
            )}
          </Dropzone>
          {/* Thumbnail */}
          {thumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${thumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onVideoTitleChange} value={videoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea
          onChange={onVideoDescriptionChange}
          value={videoDescription}
        />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {privateOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {categoryOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default VideoUploadPage;
