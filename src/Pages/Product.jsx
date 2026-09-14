import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  if (!all_product || all_product.length === 0) {
    return <h2>Loading...</h2>;
  }
  const product = all_product.find((e) => e.id.toString() === productId);

  if (!product) {
    return <h2>Product not found</h2>;
  }
  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts category={product.category} />
    </div>
  );
};

export default Product;
