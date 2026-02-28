import React from 'react';
import { useProducts } from '../infrastructure/product.hook';

const ProductPage = () => {
  const { data: productData } = useProducts();
  console.log({ productData });

  return <div>ProductPage</div>;
};

export default ProductPage;
