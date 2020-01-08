import React from 'react';
import { graphql } from 'gatsby';
import './index.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import Layout from '../components/layout';
import ProductCard from '../components/productCard';
import Cart from '../components/cart';

class IndexPage extends React.Component {
  state = {
    cart: {
      id: '',
      date: '',
      items: [],
      products: []
    }
  };

  componentDidMount = () => {
    const { data: { allStripeSku: { edges } } } = this.props;
    const products = edges.map(edge => edge.node);
    this.setState({ products })
  }

  addToCart = (product) => {
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
        items
      }
    });
  }

  removeFromCart = (sku) => {
    let items = [];

    if (this.state.cart.items.length > 1) {
      items = this.state.cart.items.filter(item => item.sku !== sku);
    }

    this.setState({
      cart: {
        items
      }
    });
  }

  removeAllFromCart = () => {
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
            {this.state.products && this.state.products.map((product, index) => {
              const { image, product: { name }, price, currency, id: sku } = product;
              return (
                <ProductCard
                  key={index}
                  image={image}
                  name={name}
                  currency={currency}
                  price={price}
                  sku={sku}
                  addToCart={this.addToCart}
                />
              );
            })}
          </div>
        </section>

        <section className="cart-section">
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
    allStripeSku {
      edges {
        node {
          currency
          id
          image
          price
          product {
            name
          }
        }
      }
    }
  }
`;

export default IndexPage;
