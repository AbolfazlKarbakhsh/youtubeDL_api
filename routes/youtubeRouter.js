const express = require("express");
const router = express.Router();
const youtubeController = require("../controllers/youtubeController");

router.post('/download',youtubeController.downloadYoutube);


module.exports = router;