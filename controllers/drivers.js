const Driver = require('../models/Driver');
const factory = require('./handlerFactory');

exports.getAllDrivers = factory.getAll(Driver);
exports.getDriver = factory.getOne(Driver, { path: 'currentCar' });
exports.createDriver = factory.createOne(Driver);
exports.updateDriver = factory.updateOne(Driver);
exports.deleteDriver = factory.deleteOne(Driver);
