type ProductProps = {
  readonly id?: number;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
};

export class Product implements ProductProps {
  readonly id?: number;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;

  constructor(props?: ProductProps) {
    Object.assign(this, props);
  }
}
