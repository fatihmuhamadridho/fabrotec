import { useQuery } from '@tanstack/react-query';
import { ProductRequest } from '../domain/product.type';
import { ProductController } from '../domain/product.controller';

const productController = new ProductController();

export const useProducts = (params?: ProductRequest.getAllProduct) => {
  const response = useQuery({
    queryKey: ['products', params],
    queryFn: () => productController.getAllProduct(params),
  });
  return response;
};
