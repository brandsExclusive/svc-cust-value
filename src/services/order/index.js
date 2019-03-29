const request = require('../../lib/request.js');
const getServiceUser = require('../../lib/getServiceUser');

let serviceCookie;

const getServiceCookie = async () => {
  if (!serviceCookie) {
    let user = await getServiceUser();
    serviceCookie = `access_token=${user.access_token}`;
  }

  return serviceCookie;
};

const getOrder = async uri => {
  const cookie = await getServiceCookie();
  const response = await request(uri, { headers: { Cookie: cookie } });
  return response.result;
};

module.exports = {
  getOrder,
  getServiceCookie
};
