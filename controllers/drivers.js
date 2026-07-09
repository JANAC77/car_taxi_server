const Driver = require('../models/Driver');
const factory = require('./handlerFactory');

exports.getAllDrivers = factory.getAll(Driver);
exports.getDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .select('+photo +licenseImage +panImage +aadhaarImage +vehicleDetails.rcImage +vehicleDetails.pucImage +vehicleDetails.insuranceImage')
      .populate('currentCar');

    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    res.status(200).json({
      success: true,
      data: driver
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
exports.createDriver = factory.createOne(Driver);
exports.updateDriver = factory.updateOne(Driver);
exports.deleteDriver = factory.deleteOne(Driver);
