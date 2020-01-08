import React from 'react';

import {
  calculateProductTotals,
  convertCentsToEuros
} from '../helpers.js';
import ReactGA from 'react-ga';

class Cart extends React.Component {
  state = {
    processing: false,
    paymentError: false
  };

  componentDidMount = () => {
    this.stripeHandler = window.Stripe(process.env.GATSBY_STRIPE_PUBLIC_KEY);
  }

  redirectToCheckout = async (event) => {
    event.preventDefault()

    ReactGA.event({
      category: 'Orders',
      action: 'User clicked the buy now button.'
    });

    const items = this.props.cart.items.map(item => { return { sku: item.sku, quantity: 1 } });
    const { error } = await this.stripeHandler.redirectToCheckout({
      items,
      successUrl: process.env.HOSTNAME,
      cancelUrl: process.env.HOSTNAME
      // billingAddressCollection: 'required'
    })
    if (error) {
      console.warn("Error:", error)
      this.setState({ paymentError: true })
    }
  }

  renderCartItems = () => {
    return this.props.cart.items.map((item, index) => {
      return (
        <li className="cart-item" key={index}>
          <div className="cancel" onClick={() => this.props.removeFromCart(item.sku)}>
            remove
          </div>
          <img src={item.image} alt={item.name} />
          <p className="description">
            <strong>{item.quantity}</strong> x {item.name}
          </p>
          <p className="price">
            <strong>€{convertCentsToEuros(item.price)}</strong>
          </p>
        </li>
      );
    });
  }

  render() {
    const { cart } = this.props;
    const { items } = cart;
    const itemsExist = items.length > 0;
    const totals = calculateProductTotals(items);

    return (
      <div className="cart-container">
        {itemsExist &&
          <button
            className="clear-cart"
            name="clear-cart"
            onClick={this.props.removeAllFromCart}
            disabled={!itemsExist}
          >
            Remove All
        </button>}
        
        <ul className="cart-items">{this.renderCartItems()}</ul>

        <div className="status">
          {itemsExist && (<>Buying <strong>{totals.quantity}</strong> for a total of <strong>€{convertCentsToEuros(totals.price)}</strong></>)}
        </div>

        <button
          className="checkout"
          name="checkout"
          onClick={event => {
            this.redirectToCheckout(event)
          }}
          disabled={!itemsExist}
        >
          Checkout
        </button>
      </div>
    );
  }
}

export default Cart;
