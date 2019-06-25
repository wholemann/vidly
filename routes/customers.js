const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const {Customer, validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);

  next();
});

router.get('/', async (req, res) => {
  const customers = await customer.Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.');
  }

  res.send(customer);
})

router.post('/', validate(validateCustomer), async (req, res) => {
  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  })
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', [validateObjectId, validate(validateCustomer)], async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  }, { new: true });

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.');
  }

  res.send(customer);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    return res.status(404).send('The customer with the given ID was not found.');
  }

  res.send(customer);
})

module.exports = router;