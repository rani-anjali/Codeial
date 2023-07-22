const express = require('express');

const router = express.Router();
const commentsApi = require("../../../controller/api/v1/comments_api");
router.get('/',commentsApi.index);
module.exports = router;
