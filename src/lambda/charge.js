require('dotenv').config({ path: '.env.backend' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  const { token, cart, args, currency } = requestBody;
  const { items: productItemData } = cart;
  const { email } = token;

  const {
    shipping_name,
    shipping_address_line1: line1,
    shipping_address_city: city,
    shipping_address_country: country
  } = args;
  const shipping = {
    name: shipping_name,
    address: {
      line1,
      city,
      country
    }
  };

  const items = productItemData.map(item => {
    const { sku: parent, quantity } = item;
    return {
      type: 'sku',
      parent,
      quantity
    };
  });

  const order = {
    currency,
    items,
    shipping,
    email
  };

  // create a customer
  stripe.customers
    .create({
      email,
      shipping,
      source: token.id // created from frontend StripeCheckout
      // source: 'tok_visa' // used during testing with frontend not available
    })
    .then(customer => {
      // create an order and attach the customer
      stripe.orders
        .create(order)
        .then(orderData => {
          const { id } = orderData;

          // pay the order and use the source token (card details)
          return stripe.orders
            .pay(id, {
              customer: customer.id,
              metadata: {
                customer: customer.id
              }
            })
            .catch(() => {
              console.log('error in stripe.orders.pay()');
              const response = {
                statusCode: 500,
                body: JSON.stringify({
                  message: 'order payment failed'
                })
              };
              callback(null, response);
            });
        })
        .then(() => {
          const response = {
            statusCode: 200,
            body: JSON.stringify({
              message: 'order creation success'
            })
          };
          callback(null, response);
        })
        .catch(() => {
          const response = {
            statusCode: 500,
            body: JSON.stringify({
              message: 'order creation failed'
            })
          };
          callback(null, response);
        });
    })
    .catch(() => {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'creating customer failed'
        })
      };
      callback(null, response);
    });
};
