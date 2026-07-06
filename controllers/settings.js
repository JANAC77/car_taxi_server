const Setting = require('../models/Setting');
const factory = require('./handlerFactory');

exports.getAllSettings = factory.getAll(Setting);
exports.getSetting = factory.getOne(Setting);
exports.createSetting = factory.createOne(Setting);
exports.updateSetting = factory.updateOne(Setting);
exports.deleteSetting = factory.deleteOne(Setting);
