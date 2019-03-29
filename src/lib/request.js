const fetch = require('node-fetch');
const prettyHrtime = require('pretty-hrtime');

module.exports = async (destination, in_options) => {
  let start = process.hrtime();
  let defaults = {
    timeout: 30000
  };
  let options = Object.assign({}, defaults, in_options);
  let response;
  try {
    response = await fetch(destination, options);
  } catch (err) {
    console.log('Exception when requesting:', destination, ':', err);
    throw err;
  }

  let body;
  // If we can't parse the json, use statusText instead
  try {
    body = await response.json();
  } catch (e) {
    body = {
      result: response.statusText
    };
  }

  if (!response.ok) {
    console.log(
      'Error when requesting:',
      destination,
      'response:',
      response.status,
      'body:',
      body
    );
    const e = new Error(body.message);
    e.status = response.status;
    throw e;
  }
  console.log(
    'Request: ',
    destination,
    ' | Time:',
    prettyHrtime(process.hrtime(start))
  );

  return body;
};
