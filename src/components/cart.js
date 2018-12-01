import React from 'react';

import {
  convertWholeDollarsToCents,
  pluralize,
  calculateProductTotals
} from '../helpers.js';

let stripeHandler = undefined;

class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      purchaseComplete: false,
      paymentError: false
    };

    this.renderStatus = this.renderStatus.bind(this);
    this.renderCartItems = this.renderCartItems.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.openStripeCheckout = this.openStripeCheckout.bind(this);
  }

  componentDidMount() {
    stripeHandler = window.StripeCheckout.configure({
      key: process.env.STRIPE_PUBLIC_KEY,
      locale: 'auto'
    });
  }

  openStripeCheckout(event) {
    event.preventDefault();

    this.setState({
      paymentError: false,
      purchaseComplete: false,
      processing: false
    });
    const cartItems = this.props.cart.items;
    const totals = calculateProductTotals(cartItems);

    stripeHandler.open({
      name: 'Tiny Shopo',
      image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
      description: `${totals.quantity} item${pluralize(totals.quantity)}`,
      shippingAddress: true,
      billingAddress: true,
      amount: convertWholeDollarsToCents(totals.price),
      currency: 'eur',
      token: (token, args) => {
        this.setState({ processing: true });
        fetch('/.netlify/functions/charge', {
          method: 'POST',
          body: JSON.stringify({
            token,
            args,
            cart: this.props.cart,
            currency: 'eur'
          })
        })
          .then(response => {
            const { status } = response;
            if (status === 200) {
              this.setState({
                processing: false,
                purchaseComplete: true,
                paymentError: false
              });
              this.props.removeAllFromCart();
            } else if (status === 500) {
              this.setState({
                processing: false,
                purchaseComplete: false,
                paymentError: true
              });
            }
            return response.json();
          })
          .catch(error => {
            this.setState({
              processing: false,
              purchaseComplete: false,
              paymentError: true
            });
            console.log('Fetch failed:' + error);
          });
      }
    });
  }

  renderStatus() {
    const cartItems = this.props.cart.items;
    let status = 'Nothing in your cart yet :(.';

    if (cartItems.length) {
      const totals = calculateProductTotals(cartItems);
      status = `It looks like you're buying <strong>${
        totals.quantity
      }</strong> for a total of <strong>€${totals.price}</strong>. Sweet!`;
    }

    return { __html: status };
  }

  removeFromCart(id) {
    this.props.removeFromCart(id);
  }

  renderCartItems() {
    return this.props.cart.items.map(item => {
      return (
        <li className="cart-item" key={item.id}>
          <div className="cancel" onClick={e => this.removeFromCart(item.id)}>
            remove
          </div>
          <img src={item.image} alt={item.image.description} />
          <p className="description">
            <strong>{item.quantity}</strong> x {item.name}
          </p>
          <p className="price">
            <strong>€{item.price}</strong>
          </p>
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <button
          className="buy"
          name="buy"
          onClick={e => this.openStripeCheckout(e)}
          disabled={this.state.processing || this.props.cart.items.length === 0}
        >
          Buy Now!
        </button>
        <button
          className="clear-cart"
          name="clear-cart"
          onClick={this.props.removeAllFromCart}
          disabled={this.state.processing || this.props.cart.items.length === 0}
        >
          Clear All
        </button>
        {this.state.purchaseComplete && (
          <h3 className="status">
            <strong>Purchase complete. Thank you!</strong>
          </h3>
        )}
        {this.state.paymentError && (
          <h3 className="status">
            <strong>
              There was an error processing your payment, please try again.
            </strong>
          </h3>
        )}
        {this.state.processing ? (
          <h3 className="status">Please wait processing payment...</h3>
        ) : (
          <React.Fragment>
            <h3
              className="status"
              dangerouslySetInnerHTML={this.renderStatus()}
            />
            <ul className="cart-items">{this.renderCartItems()}</ul>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Cart;
