const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

// process.on('uncaughtException', (ex) => {
//   winston.error(ex.message);
//   process.exit(1);
// });

// const p = Promise.reject(new Error('Something failed miserably!'));
// p.then(() => console.log('Done'));

// throw new Error('Something failed duraing startup.');

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));