import React, { useContext } from "react";
import "./RelatedProducts.css";
import { ShopContext } from "../../Context/ShopContext";
import Item from "../Item/Item";
const RelatedProducts = ({ category }) => {
  const { all_product } = useContext(ShopContext);
  const relatedProducts = all_product.filter(
    (item) => item.category === category
  );
  return (
    <div className="relatedproducts">
      <h1>Related products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((item, i) => {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
              />
            );
          })
        ) : (
          <p>No related products found</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
