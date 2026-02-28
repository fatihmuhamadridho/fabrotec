import { AxiosService } from '@utils/axios.service';
import { ProductRepository } from '../domain/product.repository';
import { ProductRequest, ProductResponse } from '../domain/product.type';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly axiosService: AxiosService) {}

  getDetailProduct(params?: ProductRequest.getDetailProduct): Promise<ProductResponse.getDetailProduct> {
    throw new Error('Method not implemented.');
  }
  createProduct(params?: ProductRequest.createProduct): Promise<ProductResponse.createProduct> {
    throw new Error('Method not implemented.');
  }
  updateProduct(params?: ProductRequest.updateProduct): Promise<ProductResponse.updateProduct> {
    throw new Error('Method not implemented.');
  }
  deleteProduct(params?: ProductRequest.deleteProduct): Promise<ProductResponse.deleteProduct> {
    throw new Error('Method not implemented.');
  }
}
