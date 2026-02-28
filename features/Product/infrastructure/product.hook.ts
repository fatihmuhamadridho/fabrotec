import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ProductRequest, ProductResult } from '../domain/product.type';
import { ProductController } from '../domain/product.controller';

const productController = new ProductController();

export const useProducts = (params?: ProductRequest.getAllProduct) => {
  const response = useQuery({
    queryKey: ['products', params],
    queryFn: () => productController.getAllProduct(params),
  });
  return response;
};

export const useInfiniteProducts = (
  params?: Omit<ProductRequest.getAllProduct, 'limit' | 'skip'>,
  pageSize = 12,
  initialPage?: ProductResult.getAllProduct,
) => {
  const response = useInfiniteQuery({
    queryKey: ['products-infinite', params, pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productController.getAllProduct({
        ...(params ?? {}),
        limit: pageSize,
        skip: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.meta?.total ?? 0;
      const loadedCount = allPages.reduce((acc, page) => acc + page.data.length, 0);

      if (loadedCount >= total || lastPage.data.length === 0) {
        return undefined;
      }
      return loadedCount;
    },
    initialData: initialPage
      ? {
          pages: [initialPage],
          pageParams: [0],
        }
      : undefined,
  });

  return response;
};

export const useProductDetail = (id?: number, initialData?: ProductResult.getDetailProduct) => {
  const response = useQuery({
    queryKey: ['product-detail', id],
    queryFn: () => productController.getDetailProduct({ id: id as number }),
    enabled: typeof id === 'number' && Number.isFinite(id),
    initialData,
  });
  return response;
};

export const useProductSearch = (q?: string) => {
  const keyword = (q ?? '').trim();

  const response = useQuery({
    queryKey: ['product-search', keyword],
    queryFn: () => productController.searchProduct({ q: keyword }),
    enabled: keyword.length > 0,
  });
  return response;
};

export const useProductCategories = (initialData?: ProductResult.getAllCategories) => {
  const response = useQuery({
    queryKey: ['product-categories'],
    queryFn: () => productController.getAllCategories(),
    initialData,
  });
  return response;
};

export const useProductCategoryList = () => {
  const response = useQuery({
    queryKey: ['product-category-list'],
    queryFn: () => productController.getCategoryList(),
  });
  return response;
};

export const useInfiniteProductsByCategory = (
  slug?: string,
  params?: Omit<ProductRequest.getProductsByCategory, 'slug' | 'limit' | 'skip'>,
  pageSize = 12,
) => {
  const normalizedSlug = (slug ?? '').trim();

  const response = useInfiniteQuery({
    queryKey: ['products-by-category-infinite', normalizedSlug, params, pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      productController.getProductsByCategory({
        slug: normalizedSlug,
        ...(params ?? {}),
        limit: pageSize,
        skip: pageParam,
      }),
    enabled: normalizedSlug.length > 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.meta?.total ?? 0;
      const loadedCount = allPages.reduce((acc, page) => acc + page.data.length, 0);

      if (loadedCount >= total || lastPage.data.length === 0) {
        return undefined;
      }
      return loadedCount;
    },
  });

  return response;
};

export const useProductsByCategory = (
  slug?: string,
  params?: Omit<ProductRequest.getProductsByCategory, 'slug'>,
  initialData?: ProductResult.getProductsByCategory,
) => {
  const normalizedSlug = (slug ?? '').trim();

  const response = useQuery({
    queryKey: ['products-by-category', normalizedSlug, params],
    queryFn: () =>
      productController.getProductsByCategory({
        slug: normalizedSlug,
        ...(params ?? {}),
    }),
    enabled: normalizedSlug.length > 0,
    initialData,
  });

  return response;
};
