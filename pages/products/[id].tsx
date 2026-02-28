import type { GetStaticPaths, GetStaticProps } from 'next';
import ProductDetailPage from '@features/Product/components/ProductDetail.page';
import { ProductController } from '@features/Product/domain/product.controller';
import { ProductResult } from '@features/Product/domain/product.type';

type ProductDetailRouteProps = {
  initialProduct: ProductResult.getDetailProduct;
  initialRecommended: ProductResult.getProductsByCategory;
};

type ProductDetailParams = {
  id: string;
};

export const getStaticPaths: GetStaticPaths<ProductDetailParams> = async () => {
  try {
    const productController = new ProductController();
    const products = await productController.getAllProduct({ limit: 30, skip: 0, select: 'id' });

    return {
      paths: products.data
        .filter((item) => typeof item.id === 'number')
        .map((item) => ({
          params: { id: String(item.id) },
        })),
      fallback: 'blocking',
    };
  } catch {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps<ProductDetailRouteProps, ProductDetailParams> = async ({ params }) => {
  const rawId = params?.id;
  const productId = Number(rawId);

  if (!rawId || !Number.isFinite(productId)) {
    return { notFound: true };
  }

  const productController = new ProductController();

  try {
    const initialProduct = await productController.getDetailProduct({ id: productId });
    const categorySlug = initialProduct.data.category ?? 'smartphones';
    let initialRecommended: ProductResult.getProductsByCategory | undefined;

    try {
      initialRecommended = await productController.getProductsByCategory({
        slug: categorySlug,
        limit: 8,
        sortBy: 'rating',
        order: 'desc',
      });
    } catch {
      initialRecommended = {
        data: [],
        meta: { total: 0, skip: 0, limit: 8 },
      };
    }

    return {
      props: {
        initialProduct: JSON.parse(JSON.stringify(initialProduct)),
        initialRecommended: JSON.parse(JSON.stringify(initialRecommended)),
      },
      revalidate: 300,
    };
  } catch {
    return { notFound: true };
  }
};

export default function ProductDetailRoutePage(props: ProductDetailRouteProps) {
  return <ProductDetailPage {...props} />;
}
