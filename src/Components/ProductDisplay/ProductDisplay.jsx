import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDisplay = ({ product }) => {
  const { addToCart, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState("");

  // quantity of this product already in the cart (object keyed by id)
  const qtyInCart = cartItems[product.id] || 0;
  const isInCart = qtyInCart > 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size");
      return;
    }
    setError("");
    addToCart(product.id);
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old">
            ${product.old_price}
          </div>
          <div className="productdisplay-right-price-new">
            ${product.new_price}
          </div>
        </div>

        <div className="productdisplay-right-description">
          {product.description ||
            "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment."}
        </div>

        <div className="productdisplay-right-size">
          <h1>Select size</h1>
          <div className="productdisplay-right-sizes">
            {SIZES.map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "size-active" : ""}
                onClick={() => {
                  setSelectedSize(size);
                  setError("");
                }}
              >
                {size}
              </div>
            ))}
          </div>
          {error && <p className="size-error">{error}</p>}
        </div>

        <div className="productdisplay-buttons">
          <button onClick={handleAddToCart}>
            {isInCart ? "ADD ANOTHER" : "ADD TO CART"}
          </button>

          {isInCart && (
            <button
              className="go-to-cart-btn"
              onClick={() => navigate("/cart")}
            >
              ✓ {qtyInCart} IN CART · GO TO CART
            </button>
          )}
        </div>

        <p className="productdisplay-right-category">
          <span>Category:</span> {product.category}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
