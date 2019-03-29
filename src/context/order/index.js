const { getOrder } = require('../../services/order');
const { convert } = require('../../lib/convertCurrency');

const getOrderDetails = async uri => {
  const orderDetails = await getOrder(uri);
  let orderTotal = orderDetails.total;

  if (orderDetails.currency_code !== 'AUD') {
    orderTotal = await convert(orderDetails);
    orderTotal = Math.round( orderTotal * 1e2 ) / 1e2;
  }

  return {
    updated_at: orderDetails.updated_at,
    id_member: orderDetails.fk_customer_id,
    total: orderTotal
  };
};

module.exports = {
  getOrderDetails
};
