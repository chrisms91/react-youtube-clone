const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = Schema(
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

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };
