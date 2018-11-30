import React from 'react';
import OptionsForm from './options-form';

class OptionsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    // const defaultImage = props.product.image;
    const defaultImage = props.product.images[0];

    // this.state = {
    //   url: defaultImage.file.url,
    //   alt: defaultImage.description
    // };
    this.state = {
      url: defaultImage
      // alt: defaultImage.description
    };
  }

  render() {
    return (
      <div className="product">
        <span className="label">{this.props.product.name}</span>
        <div className="image-container">
          <img src={this.state.url} alt={this.state.alt} />
        </div>
        <span className="price-label">
          Price €{this.props.product.metadata.price}
        </span>
        <div className="form-container">
          <OptionsForm
            product={this.props.product}
            onFormSubmit={this.props.onFormSubmit}
          />
        </div>
      </div>
    );
  }
}

export default OptionsFormContainer;
