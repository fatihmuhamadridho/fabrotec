import { ProductRepository } from './product.repository';
import { ProductRequest } from './product.type';

export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  execute(params?: ProductRequest.getAllProduct) {
    return this.productRepository.getDetailProduct(params);
  }
}
