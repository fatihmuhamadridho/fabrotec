import type { GetStaticProps } from 'next';
import ProductPage from '@features/Product/components/Product.page';
import { ProductController } from '@features/Product/domain/product.controller';
import { ProductResult } from '@features/Product/domain/product.type';

type HomePageProps = {
  initialProducts: ProductResult.getAllProduct;
  initialCategories: ProductResult.getAllCategories;
  initialError: string | null;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const productController = new ProductController();
  const [productsResult, categoriesResult] = await Promise.allSettled([
    productController.getAllProduct({ limit: 12, skip: 0 }),
    productController.getAllCategories(),
  ]);

  const initialProducts =
    productsResult.status === 'fulfilled'
      ? productsResult.value
      : {
          data: [],
          meta: {
            total: 0,
            skip: 0,
            limit: 12,
          },
        };
  const initialCategories =
    categoriesResult.status === 'fulfilled'
      ? categoriesResult.value
      : {
          data: [],
        };
  const hasError = productsResult.status === 'rejected' || categoriesResult.status === 'rejected';

  return {
    props: {
      initialProducts: JSON.parse(JSON.stringify(initialProducts)),
      initialCategories: JSON.parse(JSON.stringify(initialCategories)),
      initialError: hasError ? 'Some product data failed to load. Retrying in the background.' : null,
    },
    revalidate: 300,
  };
};

export default function HomePage(props: HomePageProps) {
  return <ProductPage {...props} />;
}
