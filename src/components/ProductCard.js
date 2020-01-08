import React from 'react';
import ImageGallery from 'react-image-gallery';
import {
  convertCentsToEuros
} from '../helpers.js';

const ProductCard = (props) => {
  const { image, name, price, addToCart, sku } = props;

  return (
    <div className="product">
      <div className="image-container">
        {/* <ImageGallery
          items={[{ original: image }]}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
        /> */}
        <img src={image} alt={name} />
      </div>
      <span className="product-name-label">{name}</span>
      <span className="price-label">
        €{convertCentsToEuros(price)}
      </span>
      <button className="add-to-cart-button" onClick={() => addToCart({ sku, quantity: 1, price, name, image })}>Add to Cart</button>
    </div>
  );

}

export default ProductCard;
