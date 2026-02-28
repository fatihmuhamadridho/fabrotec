import { BaseResponse } from '@utils/base.type';
import { Product } from './product.model';

export namespace ProductResult {
  export type getAllProduct = BaseResponse<
    Product[],
    {
      total: number;
      skip: number;
      limit: number;
    }
  >;
  export type getDetailProduct = BaseResponse<Product>;
  export type searchProduct = BaseResponse<
    Product[],
    {
      total: number;
      skip: number;
      limit: number;
    }
  >;
  export type getAllCategories = BaseResponse<ProductResponse.CategoryItem[]>;
  export type getCategoryList = BaseResponse<string[]>;
  export type getProductsByCategory = BaseResponse<
    Product[],
    {
      total: number;
      skip: number;
      limit: number;
    }
  >;
}
export namespace ProductResponse {
  export interface CategoryItem {
    slug: string;
    name: string;
    url: string;
  }

  export interface ProductItem {
    id: number;
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    discountPercentage?: number;
    rating?: number;
    stock?: number;
    tags?: string[];
    brand?: string;
    sku?: string;
    weight?: number;
    dimensions?: Dimensions;
    warrantyInformation?: string;
    shippingInformation?: string;
    availabilityStatus?: string;
    reviews?: Review[];
    returnPolicy?: string;
    minimumOrderQuantity?: number;
    meta?: Meta;
    images?: string[];
    thumbnail?: string;
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
  export type getDetailProduct = ProductItem;
  export type searchProduct = {
    products: ProductItem[];
    total: number;
    skip: number;
    limit: number;
  };
  export type getAllCategories = CategoryItem[];
  export type getCategoryList = string[];
  export type getProductsByCategory = {
    products: ProductItem[];
    total: number;
    skip: number;
    limit: number;
  };
}
export namespace ProductRequest {
  export type getAllProduct = {
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: 'title' | 'price' | 'rating' | 'stock' | 'category';
    order?: 'asc' | 'desc';
  };
  export type getDetailProduct = {
    id: number;
  };
  export type searchProduct = {
    q: string;
  };
  export type getAllCategories = undefined;
  export type getCategoryList = undefined;
  export type getProductsByCategory = {
    slug: string;
    limit?: number;
    skip?: number;
    select?: string;
    sortBy?: 'title' | 'price' | 'rating' | 'stock' | 'category';
    order?: 'asc' | 'desc';
  };
}
