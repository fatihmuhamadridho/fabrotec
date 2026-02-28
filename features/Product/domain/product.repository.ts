import { ProductRequest, ProductResponse } from './product.type';

export abstract class ProductRepository {
  abstract getAllProduct(params?: ProductRequest.getAllProduct): Promise<ProductResponse.getAllProduct>;
  abstract getDetailProduct(params?: ProductRequest.getDetailProduct): Promise<ProductResponse.getDetailProduct>;
  abstract searchProduct(params: ProductRequest.searchProduct): Promise<ProductResponse.searchProduct>;
  abstract getAllCategories(): Promise<ProductResponse.getAllCategories>;
  abstract getCategoryList(): Promise<ProductResponse.getCategoryList>;
  abstract getProductsByCategory(params: ProductRequest.getProductsByCategory): Promise<ProductResponse.getProductsByCategory>;
}
