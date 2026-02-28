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
      const response = await this.axiosService.get(`/products/${params?.id}`);
      return response;
    } catch (error) {
      handleHttpError(error, 'Product fetch failed');
    }
  }

  async searchProduct(params: ProductRequest.searchProduct): Promise<ProductResponse.searchProduct> {
    try {
      const response = await this.axiosService.get('/products/search', { params });
      return response;
    } catch (error) {
      handleHttpError(error, 'Product search failed');
    }
  }

  async getAllCategories(): Promise<ProductResponse.getAllCategories> {
    try {
      const response = await this.axiosService.get('/products/categories');
      return response;
    } catch (error) {
      handleHttpError(error, 'Product categories fetch failed');
    }
  }

  async getCategoryList(): Promise<ProductResponse.getCategoryList> {
    try {
      const response = await this.axiosService.get('/products/category-list');
      return response;
    } catch (error) {
      handleHttpError(error, 'Product category-list fetch failed');
    }
  }

  async getProductsByCategory(params: ProductRequest.getProductsByCategory): Promise<ProductResponse.getProductsByCategory> {
    try {
      const { slug, ...queryParams } = params;
      const response = await this.axiosService.get(`/products/category/${slug}`, { params: queryParams });
      return response;
    } catch (error) {
      handleHttpError(error, 'Products by category fetch failed');
    }
  }
}
