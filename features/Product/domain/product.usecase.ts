import { Product } from './product.model';
import { ProductRepository } from './product.repository';
import { ProductRequest, ProductResult } from './product.type';

export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(params?: ProductRequest.getAllProduct): Promise<ProductResult.getAllProduct> {
    const paramsMapper = params;
    const response = await this.productRepository.getAllProduct(paramsMapper);
    return {
      data: response.products.map(
        (data) =>
          new Product({
            id: data.id ?? '',
            title: data.title ?? '',
            description: data.description ?? '',
            imageUrl: undefined,
            price: data.price ?? 0,
          }),
      ),
    };
  }
}
