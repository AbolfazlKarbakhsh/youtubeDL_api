const catchAsync = require('../utils/catchAysinc');
const AppError = require('../utils/appError');
const validator = require('validator');
const { youtube } = require('btch-downloader')



function isYouTubeURL(url) {
  const youtubeRegex = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : false;  
}



exports.downloadYoutube = catchAsync(async (req, res, next) => {
  const { url } = req.body;

  if (!validator.isURL(url) ) {
    return next(new AppError("لینک وارد شده صحیح نمی‌باشد", 400));
  }
  if (!isYouTubeURL(url)) {
    return next(new AppError("لینک ارسالی لینک یوتیوب نمی باشد", 400));
  }
  const { id, mp4, mp3 } = await youtube(url);

  if (id == undefined || id == null) {
    return next(new AppError("متاسفیم ویدیو مورد نظر پیدا نشد ", 404));
  }
  if (mp4 == undefined && mp3 == undefined) {
    return next(new AppError("  ویدیو ارسالی دارای محدودیت حجمی می باشد", 400));
  }

  res.json({
    status:'success',
    data: {
      mp4: mp4,
      mp3: mp3
    },
    message: 'با موفقیت انجام شد'
  })


});
