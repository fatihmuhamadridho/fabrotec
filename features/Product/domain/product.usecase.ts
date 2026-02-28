import { Product } from './product.model';
import { ProductRepository } from './product.repository';
import { ProductRequest, ProductResponse, ProductResult } from './product.type';

const mapToProduct = (data: ProductResponse.ProductItem): Product =>
  new Product({
    id: data.id ?? 0,
    title: data.title ?? '',
    description: data.description ?? '',
    imageUrl: data.thumbnail ?? data.images?.[0] ?? '',
    images: data.images ?? [],
    price: data.price ?? 0,
    category: data.category ?? '',
    stock: data.stock ?? 0,
    availabilityStatus: data.availabilityStatus ?? '',
    brand: data.brand ?? '',
    rating: data.rating ?? 0,
  });

export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(params?: ProductRequest.getAllProduct): Promise<ProductResult.getAllProduct> {
    const paramsMapper = params;
    const response = await this.productRepository.getAllProduct(paramsMapper);
    return {
      data: response.products.map((item) => mapToProduct(item)),
      meta: {
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      },
    };
  }
}

export class GetDetailProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(params: ProductRequest.getDetailProduct): Promise<ProductResult.getDetailProduct> {
    const response = await this.productRepository.getDetailProduct(params);
    return {
      data: mapToProduct(response),
    };
  }
}

export class SearchProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(params: ProductRequest.searchProduct): Promise<ProductResult.searchProduct> {
    const response = await this.productRepository.searchProduct(params);
    return {
      data: response.products.map((item) => mapToProduct(item)),
      meta: {
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      },
    };
  }
}

export class GetAllCategoriesUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductResult.getAllCategories> {
    const response = await this.productRepository.getAllCategories();
    return {
      data: response,
    };
  }
}

export class GetCategoryListUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<ProductResult.getCategoryList> {
    const response = await this.productRepository.getCategoryList();
    return {
      data: response,
    };
  }
}

export class GetProductsByCategoryUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(params: ProductRequest.getProductsByCategory): Promise<ProductResult.getProductsByCategory> {
    const response = await this.productRepository.getProductsByCategory(params);
    return {
      data: response.products.map((item) => mapToProduct(item)),
      meta: {
        total: response.total,
        skip: response.skip,
        limit: response.limit,
      },
    };
  }
}
