import React from 'react';
import { useProducts } from '../infrastructure/product.hook';
import { Text } from '@mantine/core';

const ProductPage = () => {
  const { data: productData } = useProducts();
  console.log({ productData });

  return (
    <Text className="bg-black !text-white" fz={24}>
      ProductPage
    </Text>
  );
};

export default ProductPage;
