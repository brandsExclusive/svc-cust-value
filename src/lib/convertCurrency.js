const request = require('../lib/request');
const queryString = require('query-string');

const convert = async ({ total, currency_code }) => {
  if (currency_code === 'AUD') {
    return total;
  }
  const params = queryString.stringify({
    access_key: process.env.CURRENCY_LAYER_KEY,
    from: currency_code,
    to: 'AUD',
    amount: total
  });
  const response = await request(`https://apilayer.net/api/convert?${params}`)
  return response.result;
};

module.exports = {
  convert
};
