const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
// const { Video } = require("../models/User");

const { auth } = require('../middleware/auth');
const multer = require('multer');

// STORAGE MULTER CONFIG
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => {
  // SAVE VIDEOS IN THE SERVER
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      url: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});
module.exports = router;

router.post('/thumbnail', (req, res) => {
  let filePath = '';
  let fileDuration = '';

  // VIDEO RUNNING TIME
  ffmpeg.ffprobe(req.body.url, (err, metadata) => {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration;
  });

  // THUMBNAIL
  ffmpeg(req.body.url)
    .on('filenames', (filenames) => {
      console.log('Will generate ' + filenames.join(', '));
      console.log(filenames);

      filePath = 'uploads/thumbnails/' + filenames[0];
    })
    .on('end', () => {
      console.log('Screenshots taken');
      return res.json({
        success: true,
        url: filePath,
        fileDuration: fileDuration,
      });
    })
    .on('error', (err) => {
      console.error(err);
      return res.json({ success: false, err });
    })
    .screenshots({
      // Will take screenshots at 20%, 40%, 60% and 80% of the vi
      count: 3,
      folder: 'uploads/thumbnails',
      size: '320x240',
      // '%b': input basename (filemname w/o extension)
      filename: 'thumbnail-%b.png',
    });
});
module.exports = router;
