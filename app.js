const express = require("express");
const app = express(); 
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const { default: rateLimit } = require("express-rate-limit");

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/app/errorController.js');

// Rotes 
const youtubeDownloader = require("./routes/youtubeRouter.js");

const limiter = rateLimit({
  max:10000,
  window:60 * 60 * 100,
  message: 'to mant request this ip'
})
app.use('/api',limiter)
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json());
app.use(cors());
app.use('/storage', express.static('public'))

// routers connect
app.use('/api/v1/youtube' , youtubeDownloader)



// notFoundPage
app.use('*', (req, res, next) => {
  next(new AppError(` یافت نشد ! ${req.originalUrl} لینک : `, 404))
})
// error handeler
app.use(globalErrorHandler)

module.exports = app;