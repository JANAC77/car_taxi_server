const Car = require('../models/Car');
const factory = require('./handlerFactory');

exports.getAllCars = async (req, res, next) => {
  try {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    const docs = await Car.find(JSON.parse(queryStr))
      .populate('currentDriver', 'name phone')
      .sort('-createdAt');

    res.status(200).json({ 
      success: true, 
      count: docs.length,
      data: docs 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.getCar = factory.getOne(Car, { path: 'currentDriver' });
exports.createCar = factory.createOne(Car);
exports.updateCar = factory.updateOne(Car);
exports.deleteCar = factory.deleteOne(Car);
