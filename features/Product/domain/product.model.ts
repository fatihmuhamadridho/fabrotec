type ProductProps = {
  readonly id?: string;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
};

export class Product implements ProductProps {
  readonly id?: string;
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;

  constructor(props?: ProductProps) {
    Object.assign(this, props);
  }
}
