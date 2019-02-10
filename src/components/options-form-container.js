import React from 'react';
import OptionsForm from './options-form';
import ImageGallery from 'react-image-gallery';

class OptionsFormContainer extends React.Component {
  constructor(props) {
    super(props);

    const images = props.product.images.map(image => {
      return {
        original: image
      };
    });

    this.state = {
      images
    };
  }

  render() {
    const { images } = this.state;
    return (
      <div className="product">
        <span className="product-name-label">{this.props.product.name}</span>
        <div className="image-container">
          <ImageGallery
            items={images}
            showThumbnails={false}
            // showFullscreenButton={false}
            showPlayButton={false}
          />
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
