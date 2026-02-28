import { AxiosService } from '@utils/axios.service';
import { ProductRepository } from '../domain/product.repository';
import { ProductRequest, ProductResponse } from '../domain/product.type';
import { handleHttpError } from '@utils/handleHttpError';

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly axiosService: AxiosService) {}

  async getAllProduct(params?: ProductRequest.getAllProduct): Promise<ProductResponse.getAllProduct> {
    try {
      const response = await this.axiosService.get('/products', { params });
      return response;
    } catch (error) {
      handleHttpError(error, 'Detail product fetch failed');
    }
  }

  async getDetailProduct(params?: ProductRequest.getDetailProduct): Promise<ProductResponse.getDetailProduct> {
    try {
      const response = await this.axiosService.get('/products', { params });
      return response;
    } catch (error) {
      handleHttpError(error, 'Product fetch failed');
    }
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
