interface Product {
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

export namespace ProductResult {
  export type getAllProduct = unknown;
  export type getDetailProduct = unknown;
  export type createProduct = unknown;
  export type updateProduct = unknown;
  export type deleteProduct = unknown;
}
export namespace ProductResponse {
  export type getAllProduct = {
    products: Product[];
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
