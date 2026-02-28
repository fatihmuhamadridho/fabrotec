type ProductProps = {
  readonly id?: number;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  images?: string[];
  category?: string;
  stock?: number;
  availabilityStatus?: string;
  brand?: string;
  rating?: number;
};

export class Product implements ProductProps {
  readonly id?: number;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  images?: string[];
  category?: string;
  stock?: number;
  availabilityStatus?: string;
  brand?: string;
  rating?: number;

  constructor(props?: ProductProps) {
    Object.assign(this, props);
  }
}
