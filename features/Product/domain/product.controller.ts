import { AxiosService } from '@utils/axios.service';
import {
  GetAllCategoriesUseCase,
  GetAllProductUseCase,
  GetCategoryListUseCase,
  GetDetailProductUseCase,
  GetProductsByCategoryUseCase,
  SearchProductUseCase,
} from './product.usecase';
import { ProductRepositoryImpl } from '../infrastructure/product.repository.impl';
import { ProductRequest } from './product.type';

export class ProductController {
  private readonly axiosService: AxiosService;
  private readonly productRepositoryImpl: ProductRepositoryImpl;

  private readonly getAllProductUseCase: GetAllProductUseCase;
  private readonly getDetailProductUseCase: GetDetailProductUseCase;
  private readonly searchProductUseCase: SearchProductUseCase;
  private readonly getAllCategoriesUseCase: GetAllCategoriesUseCase;
  private readonly getCategoryListUseCase: GetCategoryListUseCase;
  private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase;

  constructor() {
    this.axiosService = new AxiosService();
    this.productRepositoryImpl = new ProductRepositoryImpl(this.axiosService);

    this.getAllProductUseCase = new GetAllProductUseCase(this.productRepositoryImpl);
    this.getDetailProductUseCase = new GetDetailProductUseCase(this.productRepositoryImpl);
    this.searchProductUseCase = new SearchProductUseCase(this.productRepositoryImpl);
    this.getAllCategoriesUseCase = new GetAllCategoriesUseCase(this.productRepositoryImpl);
    this.getCategoryListUseCase = new GetCategoryListUseCase(this.productRepositoryImpl);
    this.getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(this.productRepositoryImpl);
  }

  getAllProduct(params?: ProductRequest.getAllProduct) {
    return this.getAllProductUseCase.execute(params);
  }

  getDetailProduct(params: ProductRequest.getDetailProduct) {
    return this.getDetailProductUseCase.execute(params);
  }

  searchProduct(params: ProductRequest.searchProduct) {
    return this.searchProductUseCase.execute(params);
  }

  getAllCategories() {
    return this.getAllCategoriesUseCase.execute();
  }

  getCategoryList() {
    return this.getCategoryListUseCase.execute();
  }

  getProductsByCategory(params: ProductRequest.getProductsByCategory) {
    return this.getProductsByCategoryUseCase.execute(params);
  }
}
