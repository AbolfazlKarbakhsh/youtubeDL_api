const AppError = require('../../utils/appError');

const handelJsonWebTokenError = err => {

  const message = `لطفا وارد شوید ، توکن شما منقضی شده است`

  return new AppError(message, 401)
}
const handelValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `${errors.join('. ')}`

  return new AppError(message, 400)
}

const handelDuplicaieFeildsDB = err => {
  const message = `امکان ثبت داده تکراری مجاز نمی باشد`
  return new AppError(message, 400)
}

const handelCastErrorDB = err => {
  const message = `خطا ${err.path} : ${err.value}.`
  return new AppError(message, 400)
}

const sendErrorDev = (err, res) => {
  process.env.ERROR_HANDELING == true && console.log(err)
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message
  })
}

const sendErrorProduction = (err, res) => {
  if (err.isOperitional) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    process.env.ERROR_HANDELING == true &&  console.log('Error 💥', err);
    res.status(500).json({
      status: 'error',
      message: "خطای سمت سرور ، لطفا بعدا تلاش کنید"
    })
  }
}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == 'development') {

    sendErrorDev(err, res);

  } else if (process.env.NODE_ENV == 'production') {
    let error = err
    if (error.name === 'ValidationError') error = handelValidationErrorDB(error)
    if (error.name === 'CastError') error = handelCastErrorDB(error)
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'  ) error = handelJsonWebTokenError(error)
    if (error.code === 11000) error = handelDuplicaieFeildsDB(error);
    sendErrorProduction(error, res)
  }
  next()
}