const AWS = require('aws-sdk');
const { getOrderDetails } = require('../context/order');

const TABLE_NAME = `user-customer-value-${process.env.APP_ENV}`;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateDynamoDb = params => {
  return dynamoDb.update(params).promise();
};

const addItem = ({ id_member, total, updated_at }) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id_member: id_member
    },
    UpdateExpression: 'set #orders = :o',
    ExpressionAttributeNames: {
      '#orders': 'orders'
    },
    ConditionExpression: 'attribute_not_exists(#orders)',
    ExpressionAttributeValues: {
      ':o': {
        count: 1,
        value: total,
        updated_at: updated_at
      }
    },
    ReturnValues: 'ALL_NEW'
  };
  return updateDynamoDb(params);
};

const updateItem = ({ id_member, total, updated_at }) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id_member: id_member
    },
    UpdateExpression:
      'set #orders.#c = #orders.#c + :val, #orders.#v = #orders.#v + :value, #orders.#d = :date',
    ExpressionAttributeNames: {
      '#c': 'count',
      '#v': 'value',
      '#d': 'updated_at',
      '#orders': 'orders'
    },
    ExpressionAttributeValues: {
      ':val': 1,
      ':value': total,
      ':date': updated_at
    },
    ConditionExpression: 'attribute_exists(#orders)',
    ReturnValues: 'UPDATED_NEW'
  };
  return updateDynamoDb(params);
};

const post = (req, res) => {
  const data = req.body;

  if (!data) {
    res.status(400).send({ error: 'Missing data' });
  }

  if (data.Type === 'Notification') {
    const attributes = {
      type: data.MessageAttributes.type.Value,
      uri: data.MessageAttributes.uri.Value
    };
    return getOrderDetails(data.MessageAttributes.uri.Value)
      .then(orderData => {
        return updateItem(orderData)
          .then(newValues => res.json({ status: 200, message: newValues }))
          .catch(error => {
            let errorResponse =
              'Update action caused a Dynamodb error, check logs for specific DynamoDB error.';
            if (error.code === 'ValidationException') {
              // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
              if (error.message.includes('reserved keyword'))
                errorResponse =
                  'Reserved keywords were used as attributes, check logs for reserved keywords used.';
            }
            if (error.code === 'ConditionalCheckFailedException') {
              return addItem(orderData)
                .then(newValues =>
                  res.json({ status: 200, message: newValues })
                )
                .catch(error =>
                  res.json({ status: 500, message: errorResponse })
                )
            }
            console.log('error', error);
            res.json({
              status: 500,
              message: errorResponse,
              orderData
            });
          });
      })
      .catch(error => {
        res.json({
          status: 500,
          message: error,
          error: error
        });
      });
  } else {
    res.json({ status: 204 });
  }
};

module.exports = {
  post
};
