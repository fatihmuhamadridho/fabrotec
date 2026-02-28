import type { GetStaticProps } from 'next';
import ProductPage from '@features/Product/components/Product.page';
import { ProductController } from '@features/Product/domain/product.controller';
import { ProductResult } from '@features/Product/domain/product.type';

type HomePageProps = {
  initialProducts: ProductResult.getAllProduct;
  initialCategories: ProductResult.getAllCategories;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const productController = new ProductController();

  const [products, categories] = await Promise.all([
    productController.getAllProduct({ limit: 12, skip: 0 }),
    productController.getAllCategories(),
  ]);

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(products)),
      initialCategories: JSON.parse(JSON.stringify(categories)),
    },
    revalidate: 300,
  };
};

export default function HomePage(props: HomePageProps) {
  return <ProductPage {...props} />;
}
