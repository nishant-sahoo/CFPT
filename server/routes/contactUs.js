var express = require('express');
var router = express.Router();
var sendFeedback = require('../controller/sendFeedback')

router.post('/send',sendFeedback);

module.exports = router;