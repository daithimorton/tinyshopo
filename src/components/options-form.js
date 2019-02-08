import React from 'react';
import uuid from 'uuid/v4';

class OptionsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quantity: 1,
      price: Number(this.props.product.metadata.price),
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
      price: quantity * Number(this.props.product.metadata.price),
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
      sku: this.props.product.sku,
      productId: this.props.product.id,
      name: this.props.product.name,
      quantity: this.state.quantity,
      price: this.state.price,
      image: this.props.product.images[0]
    };

    this.props.onFormSubmit(product);
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
          className="buy-button"
          type="submit"
          name="submit"
          // disabled={this.state.quantity === 0 ? true : false}
          dangerouslySetInnerHTML={{
            __html: `Add <strong>${
              isNaN(this.state.quantity) ? '__' : this.state.quantity
            }</strong> for <strong>€${
              isNaN(this.state.price) ? '__' : this.state.price
            }</strong> to your cart?`
          }}
        />
      </form>
    );
  }
}

export default OptionsForm;
