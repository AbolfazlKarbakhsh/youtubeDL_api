const AppError = require("./appError");

class CrudFeachers {
  constructor(Model) {
    this.Model = Model;
  }
 async findUserById(req , next) {
    const doc = await this.Model.findById(req.params.id);
    if (!doc) return next(new AppError("کاربر مورد نظر یافت نشد !", 404));
    return doc;
  }

  validaiteModel = (req) => {
    const doc = new this.Model();
    return doc.checkValidReq(req);
  }
}

module.exports = CrudFeachers;