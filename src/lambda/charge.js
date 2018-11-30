require('dotenv').config({ path: '.env.backend' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const { token, charge } = requestBody;
  const { email } = token;
  console.log(charge);
  stripe.customers
    .create({
      email
    })
    .then(customer => {
      return stripe.customers.createSource(customer.id, {
        source: 'tok_visa'
      });
    })
    .then(source => {
      return stripe.charges.create({
        amount: 100,
        currency: 'eur',
        customer: source.customer
      });
    })
    .then(charge => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'You created a new charge on a new customer.',
          charge
        })
      };
      callback(null, response);
    })
    .catch(err => {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'error',
          err
        })
      };
      callback(null, response);
    });
};
