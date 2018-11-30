import React from 'react';
import { graphql } from 'gatsby';
import uuid from 'uuid/v4';
import moment from 'moment';
import './index.css';
import Layout from '../components/layout';
import OptionsFormContainer from '../components/options-form-container';
import Cart from '../components/cart';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: props.data.allContentfulProduct.edges,
      stripeProducts: props.data.allStripeProduct.edges,
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
    const items = [...this.state.cart.items, product];

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

  render() {
    return (
      <Layout>
        <h4 className="intro">
          Free shipping worldwide! Please allow up to 30 days for delivery,
          Thank you.
        </h4>

        <section>
          <h2>Products</h2>
          <div className="product-container">
            {/* {this.state.products.map((product, index) => {
              return (
                <OptionsFormContainer
                  key={index}
                  product={product.node}
                  onFormSubmit={this.handleFormSubmit}
                />
              );
            })} */}
            {this.state.stripeProducts.map((product, index) => {
              return (
                <OptionsFormContainer
                  key={index}
                  product={product.node}
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
    allContentfulProduct {
      edges {
        node {
          id
          productId
          name
          price
          image {
            file {
              url
            }
          }
        }
      }
    }
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
  }
`;

export default IndexPage;
