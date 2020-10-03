const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const disLikeSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
  },
  { timetamps: true }
);

const Dislike = mongoose.model('Dislike', disLikeSchema);

module.exports = { Dislike };
