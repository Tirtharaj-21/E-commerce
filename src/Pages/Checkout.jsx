import React, { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./CSS/Checkout.css";

const Checkout = () => {
  const { all_product, cartItems, getTotalCartAmount } =
    useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const products = all_product.filter((product) => cartItems[product.id] > 0);

  const subtotal = getTotalCartAmount();
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <div className="checkout-page">
      {/* Page Heading */}
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase securely</p>
      </div>

      <div className="checkout-layout">
        {/* LEFT SECTION */}
        <div className="checkout-left">
          {/* Customer Details */}
          <div className="checkout-card">
            <h2>Delivery Information</h2>

            <div className="checkout-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter phone number" />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <textarea rows="3" placeholder="Enter your complete address" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="City" />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input type="text" placeholder="Postal code" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="checkout-card">
            <h2>Order Items</h2>

            {products.map((product) => (
              <div className="checkout-product" key={product.id}>
                <img src={product.image} alt={product.name} />

                <div className="checkout-product-info">
                  <h3>{product.name}</h3>

                  <p>Quantity: {cartItems[product.id]}</p>
                </div>

                <strong>
                  ${(product.new_price * cartItems[product.id]).toFixed(2)}
                </strong>
              </div>
            ))}

            {products.length === 0 && <p>Your cart is empty.</p>}
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <div className="razorpay-icon">R</div>

              <div className="payment-info">
                <h3>Razorpay</h3>

                <p>UPI, Credit Card, Debit Card, Net Banking and Wallets</p>
              </div>
            </label>

            <div className="secure-payment">
              🔒 Secure payment powered by Razorpay
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="checkout-right">
          <div className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>Free</span>
            </div>

            <div className="summary-total">
              <h3>Total</h3>
              <h3>${total.toFixed(2)}</h3>
            </div>

            <button
              className="place-order-btn"
              disabled={products.length === 0}
            >
              PLACE ORDER
            </button>

            <p className="checkout-note">
              Your payment information is securely processed through Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
