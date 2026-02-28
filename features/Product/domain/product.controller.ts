import { AxiosService } from '@utils/axios.service';
import { GetAllProductUseCase } from './product.usecase';
import { ProductRepositoryImpl } from '../infrastructure/product.repository.impl';
import { ProductRequest } from './product.type';

export class ProductController {
  private readonly axiosService: AxiosService;
  private readonly productRepositoryImpl: ProductRepositoryImpl;

  private readonly getAllProductUseCase: GetAllProductUseCase;

  constructor() {
    this.axiosService = new AxiosService();
    this.productRepositoryImpl = new ProductRepositoryImpl(this.axiosService);

    this.getAllProductUseCase = new GetAllProductUseCase(this.productRepositoryImpl);
  }

  getAllProduct(params?: ProductRequest.getAllProduct) {
    return this.getAllProductUseCase.execute(params);
  }
}
