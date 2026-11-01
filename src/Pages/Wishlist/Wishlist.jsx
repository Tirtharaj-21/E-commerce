import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import {
  getWishlist,
  saveWishlist,
  all_product,
} from "../../data/customerData";
import "./Wishlist.css";

export default function Wishlist() {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState(getWishlist);

  const products = all_product.filter((product) =>
    wishlist.includes(product.id),
  );

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((itemId) => itemId !== id);
    setWishlist(updated);
    saveWishlist(updated);
  };

  const handleAddToCart = (id) => {
    addToCart(id);
    removeFromWishlist(id);
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div>
          <h1>My Wishlist</h1>
          <p>Your favourite products in one place.</p>
        </div>
        <span>{products.length} Items</span>
      </div>

      {products.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-empty-icon">♡</span>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love and find them here.</p>
          <button onClick={() => navigate("/shop")}>Explore Products</button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {products.map((product) => (
            <div className="wishlist-card" key={product.id}>
              <button
                className="wishlist-remove"
                onClick={() => removeFromWishlist(product.id)}
                title="Remove from wishlist"
              >
                ×
              </button>

              <img
                src={product.image}
                alt={product.name}
                onClick={() => navigate(`/product/${product.id}`)}
              />

              <div className="wishlist-info">
                <h3>{product.name}</h3>

                <div className="wishlist-price">
                  <strong>₹{product.new_price}</strong>
                  <del>₹{product.old_price}</del>
                </div>

                <button
                  className="wishlist-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
