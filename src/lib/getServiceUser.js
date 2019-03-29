const request = require('./request');
const queryString = require('query-string');
const jwtDecode = require('jwt-decode');
const LRU = require('lru-cache');

const serviceUserKey = 'order:getServiceUser';
const CACHE_TIMEOUT = 3600;

const cache = new LRU({ maxAge: CACHE_TIMEOUT });

module.exports = async () => {
  const cachedResponse = cache.get(serviceUserKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  const credentials = {
    username: `operations+${process.env.HEROKU_APP_NAME}@luxgroup.com`,
    password: process.env.SERVICE_PASSWORD,
    grant_type: 'client_credentials'
  };

  const options = {
    method: 'POST',
    body: queryString.stringify(credentials),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  const destination = process.env.AUTH_HOST + '/oauth/token';
  let response = await request(destination, options);
  response.service_user_id = jwtDecode(response.access_token).sub;
  cache.set(serviceUserKey, response);
  return response;
};
