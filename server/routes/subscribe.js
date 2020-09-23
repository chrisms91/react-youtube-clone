const express = require('express');
const router = express.Router();
const { Subscriber } = require('../models/Subscriber');
const { auth } = require('../middleware/auth');

//=================================
//             Subscribe
//=================================

router.get('/subscribeNumber', (req, res) => {
  const userToId = req.query.userTo;

  Subscriber.find({ userTo: userToId }).exec((err, subscribe) => {
    if (err) return res.status(400).json({ success: false, err });
    return res
      .status(200)
      .json({ success: true, subscribeNumber: subscribe.length });
  });
});

router.post('/subscribed', (req, res) => {
  const { userTo, userFrom } = req.body;

  Subscriber.find({ userTo: userTo, userFrom: userFrom }).exec(
    (err, subscribe) => {
      if (err) return res.status(400).json({ success: false, err });
      let result = false;
      if (subscribe.length !== 0) {
        result = true;
      }
      res.status(200).json({ success: true, subscribed: result });
    }
  );
});

router.post('/subscribe', (req, res) => {
  const newSubscribe = new Subscriber(req.body);

  newSubscribe.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

router.post('/unsubscribe', (req, res) => {
  const { userTo, userFrom } = req.body;
  Subscriber.findOneAndDelete({ userTo: userTo, userFrom: userFrom }).exec(
    (err, doc) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true, doc });
    }
  );
});

module.exports = router;
