import React from 'react';
import OptionsForm from './options-form';

class OptionsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    const defaultImage = props.product.image;

    this.state = {
      url: defaultImage.file.url,
      alt: defaultImage.description
    };
  }

  render() {
    return (
      <div className="product">
        <div className="image-container">
          <img src={this.state.url} alt={this.state.alt} />
        </div>
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
