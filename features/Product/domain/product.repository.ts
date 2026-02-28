import { ProductRequest, ProductResponse } from './product.type';

export abstract class ProductRepository {
  abstract getAllProduct(params?: ProductRequest.getAllProduct): Promise<ProductResponse.getAllProduct>;
  abstract getDetailProduct(params?: ProductRequest.getDetailProduct): Promise<ProductResponse.getDetailProduct>;
  abstract createProduct(params?: ProductRequest.createProduct): Promise<ProductResponse.createProduct>;
  abstract updateProduct(params?: ProductRequest.updateProduct): Promise<ProductResponse.updateProduct>;
  abstract deleteProduct(params?: ProductRequest.deleteProduct): Promise<ProductResponse.deleteProduct>;
}
