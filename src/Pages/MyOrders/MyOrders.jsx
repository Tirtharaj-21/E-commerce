import React, { useState } from "react";
import { getOrders } from "../../data/customerData";
import "./MyOrders.css";

export default function MyOrders() {
  const [orders] = useState(getOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatPrice = (price) => `₹${Number(price).toLocaleString("en-IN")}`;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders</h1>
          <p>Track and manage your purchases.</p>
        </div>
        <span>{orders.length} Orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <p>Your purchases will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <h3>{order.id}</h3>
                  <p>Placed on {order.date}</p>
                </div>
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div>
                  <p className="order-label">Items</p>
                  <strong>{order.items.length} Products</strong>
                </div>

                <div>
                  <p className="order-label">Total</p>
                  <strong>{formatPrice(order.total)}</strong>
                </div>

                <div>
                  <p className="order-label">Payment</p>
                  <strong>{order.paymentStatus}</strong>
                </div>
              </div>

              <div className="order-card-footer">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="order-details-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <button
              className="order-modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h2>Order Details</h2>
            <p className="order-modal-id">{selectedOrder.id}</p>

            {selectedOrder.items.map((item, index) => (
              <div className="order-modal-item" key={index}>
                <div>
                  <strong>{item.name}</strong>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <strong>{formatPrice(item.price)}</strong>
              </div>
            ))}

            <div className="order-modal-total">
              <span>Total Amount</span>
              <strong>{formatPrice(selectedOrder.total)}</strong>
            </div>

            <p>Order Status: {selectedOrder.status}</p>
            <p>Payment Status: {selectedOrder.paymentStatus}</p>
          </div>
        </div>
      )}
    </div>
  );
}
