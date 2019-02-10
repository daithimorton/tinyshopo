import React from 'react';
import { graphql } from 'gatsby';
import uuid from 'uuid/v4';
import moment from 'moment';
import './index.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import Layout from '../components/layout';
import OptionsFormContainer from '../components/options-form-container';
import Cart from '../components/cart';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-63312977-14');
class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stripeProducts: props.data.allStripeProduct.edges,
      stripeSkus: props.data.allStripeSku.edges,
      cart: {
        id: '',
        date: '',
        items: []
      }
    };

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.removeAllFromCart = this.removeAllFromCart.bind(this);
  }

  handleFormSubmit(product) {
    let items = this.state.cart.items;
    const cartItem = items.find(item => item.sku === product.sku);
    if (cartItem) {
      // product is already in the cart so update quantity
      cartItem.quantity += product.quantity;
      cartItem.price += product.price;
    } else {
      // product is not in the cart so add it
      items = [...this.state.cart.items, product];
    }

    this.setState({
      cart: {
        id: uuid(),
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        items
      }
    });
  }

  removeFromCart(productId) {
    let items = [];

    if (this.state.cart.items.length > 1) {
      items = this.state.cart.items.filter(item => item.id !== productId);
    }

    this.setState({
      cart: {
        id: uuid(),
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        items
      }
    });
  }

  removeAllFromCart() {
    this.setState({
      cart: {
        id: '',
        date: '',
        items: []
      }
    });
  }

  getSkuForProduct = product => {
    const sku = this.state.stripeSkus.filter(
      sku => sku.node.product.id === product.node.id
    );
    return sku[0].node;
  };

  render() {
    return (
      <Layout>
        <h4 className="intro">
          Free shipping worldwide! Please allow up to 60 days for delivery,
          Thank you.
        </h4>

        <section>
          <h2>Products</h2>
          <div className="product-container">
            {this.state.stripeProducts.map((product, index) => {
              const productSku = this.getSkuForProduct(product);
              const productData = {
                ...product.node,
                sku: productSku.id,
                currency: productSku.currency
              };

              return (
                <OptionsFormContainer
                  key={index}
                  product={productData}
                  onFormSubmit={this.handleFormSubmit}
                />
              );
            })}
          </div>
        </section>

        <section className="cart">
          <h2>Your Cart</h2>
          <Cart
            cart={this.state.cart}
            products={this.state.products}
            removeFromCart={this.removeFromCart}
            removeAllFromCart={this.removeAllFromCart}
          />
        </section>
      </Layout>
    );
  }
}

export const query = graphql`
  {
    allStripeProduct {
      edges {
        node {
          id
          name
          images
          metadata {
            price
          }
        }
      }
    }
    allStripeSku {
      edges {
        node {
          id
          currency
          price
          product {
            id
          }
        }
      }
    }
  }
`;

export default IndexPage;
