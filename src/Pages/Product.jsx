import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";

import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

import "./CSS/Product.css";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();

  if (!all_product || all_product.length === 0) {
    return <div className="product-loading">Loading product...</div>;
  }

  const product = all_product.find((item) => item.id.toString() === productId);

  if (!product) {
    return <div className="product-loading">Product not found.</div>;
  }

  return (
    <div className="customer-product-page">
      <Breadcrum product={product} />

      <ProductDisplay product={product} />

      <DescriptionBox />

      <RelatedProducts category={product.category} />
    </div>
  );
};

export default Product;
