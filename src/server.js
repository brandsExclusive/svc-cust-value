require('dotenv-safe').config();

const express = require('express');
const bodyParser = require('body-parser');
const { post } = require('./lib/requestHandler');
const {
  snsConfirmationHandler,
  updateContentType
} = require('./middleware/snsHandler');

const {
  PORT = 3000,
  AWS_ACCESS_KEY_ID: accessKeyId,
  AWS_SECRET_ACCESS_KEY: secretAccessKey,
  AWS_REGION: region,
  AWS_ENDPOINT: awsEndpoint
} = process.env;

exports.getServer = () => {
  const app = express();

  app.use(updateContentType());
  app.use(bodyParser.json());
  app.use(snsConfirmationHandler());

  app.use((req, res, next) => {
    // add CORS headers
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, account, Authorization, X-Amz-Date, X-Api-Key, X-Amz-Security-Token'
    );
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Vary', 'Origin');
    next();
  });

  app.options('/', (req, res) => {
    res.status(200);
  });

  app.post('/', post);

  app.get('/', (req, res) => {
    res.send('Meep');
  });

  return app;
};
