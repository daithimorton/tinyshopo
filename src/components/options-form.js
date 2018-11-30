import React from 'react';
import uuid from 'uuid/v4';
import { pluralize } from '../helpers.js';

class OptionsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 0,
      price: 0,
      error: ''
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAmountChange(event) {
    const value = event.target.value;
    const quantity = parseInt(value, 10);
    let error = '';

    if (isNaN(quantity)) {
      error = "Quantity can't be blank!";
    }

    this.setState({
      quantity,
      price: quantity * this.props.product.price,
      error
    });
  }

  handleSelectChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (isNaN(this.state.quantity)) {
      return this.setState({
        error: "Quantity still can't be blank!"
      });
    }

    const product = {
      id: uuid(),
      contentfulId: this.props.product.id,
      productId: this.props.product.productId,
      quantity: this.state.quantity,
      price: this.state.price,
      image: this.props.product.image
    };

    this.props.onFormSubmit(product);

    // Reset form values
    this.setState({
      quantity: 0,
      price: 0,
      error: ''
    });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <p className="error">{this.state.error}</p>
        <div className="form-element">
          <label>
            <span className="label">Quantity</span>
            <input
              type="number"
              name="quantity"
              min="0"
              value={isNaN(this.state.quantity) ? '' : this.state.quantity}
              onChange={this.handleAmountChange}
            />
          </label>
        </div>
        <button
          type="submit"
          name="submit"
          disabled={this.state.quantity === 0 ? true : false}
        >
          {`Add ${
            isNaN(this.state.quantity) ? '__' : this.state.quantity
          }, unicorn${pluralize(this.state.quantity)} for €${
            isNaN(this.state.price) ? '__' : this.state.price
          } to your cart?`}
        </button>
      </form>
    );
  }
}

export default OptionsForm;
