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
      product: props.data.allContentfulProduct.edges[0].node,
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
        <p className="intro">
          Welcome to Tiny Shopo for all your hobby electronic needs!
        </p>

        <section>
          <h2>Products</h2>
          <OptionsFormContainer
            product={this.state.product}
            onFormSubmit={this.handleFormSubmit}
          />
          <OptionsFormContainer
            product={this.state.product}
            onFormSubmit={this.handleFormSubmit}
          />
        </section>

        <section className="cart">
          <h2>Your Cart</h2>
          <Cart
            cart={this.state.cart}
            product={this.state.product}
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
          images {
            description
            file {
              url
            }
          }
          colors
          sizes
        }
      }
    }
  }
`;

export default IndexPage;
