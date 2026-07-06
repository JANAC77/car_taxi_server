const fs = require('fs');
const path = require('path');

const entities = ['Place', 'Booking', 'Payment', 'Setting'];
const allEntities = ['Customer', 'Driver', 'Car', 'Place', 'Booking', 'Payment', 'Setting'];

// Generate Controllers
entities.forEach(entity => {
  const lowerName = entity.toLowerCase() + 's';
  const content = `const ${entity} = require('../models/${entity}');
const factory = require('./handlerFactory');

exports.getAll${entity}s = factory.getAll(${entity});
exports.get${entity} = factory.getOne(${entity});
exports.create${entity} = factory.createOne(${entity});
exports.update${entity} = factory.updateOne(${entity});
exports.delete${entity} = factory.deleteOne(${entity});
`;
  fs.writeFileSync(path.join(__dirname, 'controllers', `${lowerName}.js`), content);
});

// Generate Routes
allEntities.forEach(entity => {
  const lowerName = entity.toLowerCase() + 's';
  const content = `const express = require('express');
const {
  getAll${entity}s,
  get${entity},
  create${entity},
  update${entity},
  delete${entity}
} = require('../controllers/${lowerName}');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All routes protected

router.route('/')
  .get(getAll${entity}s)
  .post(create${entity});

router.route('/:id')
  .get(get${entity})
  .put(update${entity})
  .delete(delete${entity});

module.exports = router;
`;
  fs.writeFileSync(path.join(__dirname, 'routes', `${lowerName}.js`), content);
});

console.log('Controllers and Routes generated successfully!');
