const express = require('express');
const router = express.Router();
const { Comment } = require('../models/Comment');
const { auth } = require('../middleware/auth');

//=================================
//             Comment
//=================================

router.get('/getComments', (req, res) => {
  Comment.find({ postId: req.query.postId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true, comments });
    });
});

router.post('/saveComment', (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) return res.status(404).json({ success: false, err });

    // since we can't use populate directly here, find the comment model again and populate writer to grab writer's information with comment
    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) res.status(404).json({ success: false, err });
        res.status(200).json({ success: true, result });
      });
  });
});

module.exports = router;
