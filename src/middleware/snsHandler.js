const xml2js = require('xml2js');
const request = require('request');

const updateContentType = () => {
  return (req, res, next) => {
    if (req.headers['x-amz-sns-message-type']) {
      req.headers['content-type'] = 'application/json;charset=UTF-8';
    }
    next();
  };
};

const snsConfirmationHandler = () => {
  return (req, res, next) => {
    // http://docs.aws.amazon.com/sns/latest/dg/SendMessageToHttp.html
    if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
      const subscribeUrl = req.body.SubscribeURL;
      console.log(`Received SubscriptionConfirmation request: ${subscribeUrl}`);

      return request({ uri: subscribeUrl }, (error, response, body) => {
        if (error) {
          res.status(400).send({ error: error.message });
        }

        // SNS SubscribeURL returns xml document
        const parser = new xml2js.Parser();
        return parser.parseString(body, (error, data) => {
          if (error) {
            res.status(400).send({ error: error.message });
          }

          let subscriptionArn;
          try {
            subscriptionArn =
              data.ConfirmSubscriptionResponse.ConfirmSubscriptionResult[0]
                .SubscriptionArn[0];
            if (!subscriptionArn) {
              res.status(400).send({ error: 'No SubscriptionArn found' });
            }
            console.log(`Subscription: ${subscriptionArn}`);
          } catch (error) {
            res.status(400).send({ error: 'No SubscriptionArn found' });
          }

          res.send('Subscribed');
        });
      });
    } else {
      next();
    }
  };
};

module.exports = {
  snsConfirmationHandler,
  updateContentType
};
