const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
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

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ email: req.body.email }); 
  if (user) {
    return res.status(400).send('User already registered.');
  }

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;