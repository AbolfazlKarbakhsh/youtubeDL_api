class APIFeatears {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
    this.customFilters = {};
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFeild = ['page', 'sort', 'limit', 'feilds'];
    excludedFeild.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find({
      ...JSON.parse(queryStr),
      ...this.customFilters
    });
    // console.log({
    //   ...JSON.parse(queryStr),
    //   ...this.customFilters
    // });
    return this;
  }


  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort('-createAt')
    }
    return this;
  }

  limited() {
    if (this.queryString.feilds) {
      const feildsBy = this.queryString.feilds.split(',').join(' ');
      this.query = this.query.select(feildsBy);
    } else {
      this.query.select('-__v')
    }
    return this;
  }

  pagination() {
    const pageIndex = this.queryString.page * 1 || 1;
    const limitIndex = this.queryString.limit * 1 || 100;
    const skip = (pageIndex - 1) * limitIndex;
    this.query = this.query.skip(skip).limit(limitIndex);

    return this;
  }

  addCustomFilter(field, condition) {
    if(this.queryString[field]){
      this.customFilters[field] = condition;
    }
    return this;
  }

}

module.exports = APIFeatears;