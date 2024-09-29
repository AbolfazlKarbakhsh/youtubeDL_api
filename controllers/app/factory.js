const APIFeatears = require("../../utils/ApiFeacters");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAysinc")


exports.deleteOne = Model => (catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id)
  if (doc == null) {
    return next(new AppError("موردی یافت نشد !", 404))
  }
  res.status(200).json({
    message: "با موفقیت حذف شد !",
    data: null
  });
}))

exports.updateOne = (Model) => 
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("موردی یافت نشد!", 404));
    }

    const updatedDoc = new Model(req.body);
    updatedDoc._id = doc._id; 

    const validationError = updatedDoc.validateSync();
    if (validationError) {
      return next(validationError);
    }

   const newDoc =  await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      message: "با موفقیت ویرایش شد!",
      data: newDoc,
    });
  });
  

exports.createOne = Model => (
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(200).json({
      message: "با موفقیت ایجاد شد ! ",
      data: newDoc,
    });
  })
)

exports.getOne = (Model, populateOptions) => (
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions)

    const doc = await query;

    if (doc == null) {
      return next(new AppError("موردی یافت نشد !", 404))
    }
    res.status(200).json({
      message: "داده مورد نظر با موفقیت دریافت شد !",
      data: doc,
    });
  })
)

exports.getALL = (Model, populateOptions) => (
  catchAsync(async (req, res, next) => {
    let query = Model.find()
    if (populateOptions) query = query.populate(populateOptions);

    const featurs = new APIFeatears(query, req.query)
      .filter()
      .sort()
      .limited()
      .pagination()

    const doc = await featurs.query;
    if (doc == null) {
      return next(new AppError("موردی یافت نشد !", 404))
    }
    res.status(200).json({
      status: 'success',
      message: "داده مورد نظر با موفقیت دریافت شد !",
      resualtCount: doc.length,
      data: doc,
    });
  })
)
