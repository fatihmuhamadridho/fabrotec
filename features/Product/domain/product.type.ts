import { BaseResponse } from '@utils/base.type';
import { Product } from './product.model';

export namespace ProductResult {
  export type getAllProduct = BaseResponse<Product[]>;
  export type getDetailProduct = unknown;
  export type createProduct = unknown;
  export type updateProduct = unknown;
  export type deleteProduct = unknown;
}
export namespace ProductResponse {
  interface ProductItem {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand?: string;
    sku: string;
    weight: number;
    dimensions: Dimensions;
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: string;
    reviews: Review[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: Meta;
    images: string[];
    thumbnail: string;
  }

  interface Dimensions {
    width: number;
    height: number;
    depth: number;
  }

  interface Review {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }

  interface Meta {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  }

  export type getAllProduct = {
    products: ProductItem[];
    total: number;
    skip: number;
    limit: number;
  };
  export type getDetailProduct = unknown;
  export type createProduct = unknown;
  export type updateProduct = unknown;
  export type deleteProduct = unknown;
}
export namespace ProductRequest {
  export type getAllProduct = unknown;
  export type getDetailProduct = unknown;
  export type createProduct = unknown;
  export type updateProduct = unknown;
  export type deleteProduct = unknown;
}
