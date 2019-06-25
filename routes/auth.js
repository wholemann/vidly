const validate = require('../middleware/validate');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/user');
const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  console.log('Request Type:', req.method);

  next();
});

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email }); 
  if (!user) {
    return res.status(400).send('Invalid email or password.');
  }
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid email or password.');
  }
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;