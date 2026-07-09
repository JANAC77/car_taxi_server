const VehicleType = require('../models/VehicleType');
const factory = require('./handlerFactory');

// @desc    Get all vehicle types
// @route   GET /api/v1/vehicle-types
// @access  Private
exports.getAllVehicleTypes = factory.getAll(VehicleType);

// @desc    Get single vehicle type
// @route   GET /api/v1/vehicle-types/:id
// @access  Private
exports.getVehicleType = factory.getOne(VehicleType);

// @desc    Create vehicle type
// @route   POST /api/v1/vehicle-types
// @access  Private/Admin
exports.createVehicleType = factory.createOne(VehicleType);

// @desc    Update vehicle type
// @route   PUT /api/v1/vehicle-types/:id
// @access  Private/Admin
exports.updateVehicleType = factory.updateOne(VehicleType);

// @desc    Delete vehicle type
// @route   DELETE /api/v1/vehicle-types/:id
// @access  Private/Admin
exports.deleteVehicleType = factory.deleteOne(VehicleType);
