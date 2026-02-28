import React from 'react';
import {
  useInfiniteProducts,
  useInfiniteProductsByCategory,
  useProductCategories,
  useProductSearch,
} from '../infrastructure/product.hook';
import { Badge, Loader, Select, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ProductResult } from '../domain/product.type';
import styles from './Product.page.module.scss';

const formatPrice = (value?: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const IMAGE_BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEwIDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjgiIGZpbGw9IiNlZWYyZjYiLz48L3N2Zz4=';

type ProductPageProps = {
  initialProducts?: ProductResult.getAllProduct;
  initialCategories?: ProductResult.getAllCategories;
  initialError?: string | null;
};

const ProductPage = ({ initialProducts, initialCategories, initialError }: ProductPageProps) => {
  const router = useRouter();
  const { data: categoriesData, isError: isCategoriesError } = useProductCategories(initialCategories);
  const [searchKeyword, setSearchKeyword] = React.useState<string>('');
  const [debouncedSearchKeyword] = useDebouncedValue(searchKeyword.trim(), 350);
  const { data: searchData, isFetching: isSearchFetching, isError: isSearchError } = useProductSearch(debouncedSearchKeyword);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortByPrice, setSortByPrice] = React.useState<string>('none');
  const [snackbarMessage, setSnackbarMessage] = React.useState<string | null>(initialError ?? null);
  const [isInfiniteTriggerLocked, setIsInfiniteTriggerLocked] = React.useState(false);
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  const isSentinelIntersectingRef = React.useRef(false);
  const isSearchMode = debouncedSearchKeyword.length > 0;
  const isCategoryMode = !isSearchMode && selectedCategory !== 'all';
  const isDefaultMode = !isSearchMode && selectedCategory === 'all';
  const apiSortParams =
    sortByPrice === 'none'
      ? undefined
      : {
          sortBy: 'price' as const,
          order: sortByPrice as 'asc' | 'desc',
        };

  const {
    data: allProductsData,
    isLoading: isAllProductsLoading,
    hasNextPage: allProductsHasNextPage,
    isFetchingNextPage: isAllProductsFetchingNextPage,
    fetchNextPage: fetchAllProductsNextPage,
    isError: isAllProductsError,
  } = useInfiniteProducts(
    apiSortParams,
    12,
    isDefaultMode && sortByPrice === 'none' ? initialProducts : undefined,
    isDefaultMode,
  );

  const {
    data: categoryProductsData,
    isLoading: isCategoryProductsLoading,
    hasNextPage: categoryProductsHasNextPage,
    isFetchingNextPage: isCategoryProductsFetchingNextPage,
    fetchNextPage: fetchCategoryProductsNextPage,
    isError: isCategoryProductsError,
  } = useInfiniteProductsByCategory(
    selectedCategory,
    apiSortParams,
    12,
    isCategoryMode,
  );

  const products = React.useMemo(() => {
    if (isSearchMode) {
      return searchData?.data ?? [];
    }

    if (isCategoryMode) {
      return categoryProductsData?.pages.flatMap((page) => page.data) ?? [];
    }

    return allProductsData?.pages.flatMap((page) => page.data) ?? [];
  }, [allProductsData?.pages, categoryProductsData?.pages, isCategoryMode, isSearchMode, searchData?.data]);

  const totalProducts = React.useMemo(() => {
    if (isSearchMode) {
      return searchData?.meta?.total ?? searchData?.data.length ?? 0;
    }

    if (isCategoryMode) {
      return categoryProductsData?.pages?.[0]?.meta?.total ?? products.length;
    }

    return allProductsData?.pages?.[0]?.meta?.total ?? products.length;
  }, [allProductsData?.pages, categoryProductsData?.pages, isCategoryMode, isSearchMode, products.length, searchData?.data.length, searchData?.meta?.total]);

  const categoryOptions = React.useMemo(() => {
    const apiCategories = categoriesData?.data ?? [];
    const fallbackCategories = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).map((slug) => ({
      slug: slug as string,
      name: slug as string,
      url: '',
    }));
    const merged = apiCategories.length > 0 ? apiCategories : fallbackCategories;

    return [
      { value: 'all', label: 'All Categories' },
      ...merged.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    ];
  }, [categoriesData?.data, products]);

  const visibleProducts = React.useMemo(() => {
    if (isSearchMode) {
      return products.filter((product) => selectedCategory === 'all' || product.category === selectedCategory);
    }
    return products;
  }, [isSearchMode, products, selectedCategory]);

  const hasNextPage = isCategoryMode ? categoryProductsHasNextPage : allProductsHasNextPage;
  const isFetchingNextPage = isCategoryMode ? isCategoryProductsFetchingNextPage : isAllProductsFetchingNextPage;
  const fetchNextPage = isCategoryMode ? fetchCategoryProductsNextPage : fetchAllProductsNextPage;
  const isLoading = isSearchMode ? false : isCategoryMode ? isCategoryProductsLoading : isAllProductsLoading;
  const isProductsError = isSearchMode ? false : isCategoryMode ? isCategoryProductsError : isAllProductsError;
  const canLoadMore = !isSearchMode && products.length < totalProducts;

  React.useEffect(() => {
    if (isSearchMode) {
      return;
    }

    const sentinel = loadMoreRef.current;
    if (!sentinel || !canLoadMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isIntersecting = Boolean(entry?.isIntersecting);
        isSentinelIntersectingRef.current = isIntersecting;

        if (isIntersecting && canLoadMore && !isFetchingNextPage && !isInfiniteTriggerLocked) {
          setIsInfiniteTriggerLocked(true);
          void fetchNextPage();
        }

        if (!isIntersecting && isInfiniteTriggerLocked && !isFetchingNextPage) {
          setIsInfiniteTriggerLocked(false);
        }
      },
      { rootMargin: '0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore, fetchNextPage, isFetchingNextPage, isInfiniteTriggerLocked, isSearchMode]);

  React.useEffect(() => {
    if (!isFetchingNextPage && isInfiniteTriggerLocked && !isSentinelIntersectingRef.current) {
      setIsInfiniteTriggerLocked(false);
    }
  }, [isFetchingNextPage, isInfiniteTriggerLocked, products.length]);

  React.useEffect(() => {
    setIsInfiniteTriggerLocked(false);
    isSentinelIntersectingRef.current = false;
  }, [debouncedSearchKeyword, selectedCategory, sortByPrice]);

  React.useEffect(() => {
    if (isProductsError || isCategoriesError || (isSearchMode && isSearchError)) {
      setSnackbarMessage('Network issue: some product data could not be loaded. Please try again.');
    }
  }, [isCategoriesError, isProductsError, isSearchError, isSearchMode]);

  React.useEffect(() => {
    if (!snackbarMessage) {
      return;
    }

    const timeoutId = setTimeout(() => setSnackbarMessage(null), 4200);
    return () => clearTimeout(timeoutId);
  }, [snackbarMessage]);

  return (
    <section className={styles.page}>
      <div className={styles.backgroundGlowTop} />
      <div className={styles.backgroundGlowBottom} />
      {snackbarMessage ? (
        <div className={styles.snackbar} role="status" aria-live="polite">
          <span>{snackbarMessage}</span>
          <button type="button" className={styles.snackbarClose} onClick={() => setSnackbarMessage(null)} aria-label="Close">
            ✕
          </button>
        </div>
      ) : null}

      <div className={styles.container}>
        <div className={styles.hero}>
          <Badge variant="filled" color="dark">
            Product Catalog
          </Badge>
          <Text className={styles.heroTitle}>Find Your Next Product</Text>
          <Text className={styles.heroSubtitle}>
            Curated picks with fast filtering and clean price sorting. Tap any product to open the detail page.
          </Text>
          <div className={styles.heroStats}>
            <div className={styles.heroStatItem}>
              <Text className={styles.heroStatLabel}>Products</Text>
              <Text className={styles.heroStatValue}>
                {products.length}/{totalProducts}
              </Text>
            </div>
            <div className={styles.heroStatItem}>
              <Text className={styles.heroStatLabel}>Categories</Text>
              <Text className={styles.heroStatValue}>{categoryOptions.length - 1}</Text>
            </div>
          </div>
        </div>

        <div className={styles.filterPanel}>
          <TextInput
            label="Search Product"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.currentTarget.value)}
            placeholder="Try: phone, iphone, watch..."
            classNames={{
              label: styles.selectLabel,
              input: styles.selectInput,
            }}
          />
          <Select
            label="Category"
            data={categoryOptions}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value ?? 'all')}
            classNames={{
              label: styles.selectLabel,
              input: styles.selectInput,
              dropdown: styles.selectDropdown,
            }}
          />
          <Select
            label="Sort by Price"
            value={sortByPrice}
            onChange={(value) => setSortByPrice(value ?? 'none')}
            data={[
              { value: 'none', label: 'Default' },
              { value: 'asc', label: 'Lowest to Highest' },
              { value: 'desc', label: 'Highest to Lowest' },
            ]}
            classNames={{
              label: styles.selectLabel,
              input: styles.selectInput,
              dropdown: styles.selectDropdown,
            }}
          />
          <button
            className={styles.resetButton}
            type="button"
            onClick={() => {
              setSearchKeyword('');
              setSelectedCategory('all');
              setSortByPrice('none');
            }}
          >
            Reset Filter
          </button>
        </div>

        {isLoading && !isSearchMode ? (
          <div className={styles.listLoading}>
            <Loader color="dark" />
            <Text>Loading products...</Text>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className={styles.emptyState}>No products found for this filter.</div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {visibleProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className={styles.productCard}
                  onMouseEnter={() => {
                    if (product.id) {
                      void router.prefetch(`/products/${product.id}`);
                    }
                  }}
                  onFocus={() => {
                    if (product.id) {
                      void router.prefetch(`/products/${product.id}`);
                    }
                  }}
                >
                  <div className={styles.cardImageWrap}>
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title ?? 'Product image'}
                        className={styles.cardImage}
                        fill
                        priority={index < 4}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_PLACEHOLDER}
                        sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardTopRow}>
                      <Badge size="sm" radius="sm" color="gray" variant="light">
                        {product.category || 'Uncategorized'}
                      </Badge>
                      <Text className={styles.cardPrice}>${formatPrice(product.price)}</Text>
                    </div>
                    <Text className={styles.cardTitle}>{product.title}</Text>
                    <Text className={styles.cardDescription}>{product.description}</Text>
                  </div>
                </Link>
              ))}
            </div>

            {isSearchMode ? null : <div ref={loadMoreRef} className={styles.loadMoreSentinel} />}

            {isSearchMode && isSearchFetching ? (
              <div className={styles.loadMoreState}>
                <Loader size="sm" color="dark" />
                <Text>Searching products...</Text>
              </div>
            ) : null}

            {!isSearchMode && isFetchingNextPage ? (
              <div className={styles.loadMoreState}>
                <Loader size="sm" color="dark" />
                <Text>Loading more products...</Text>
              </div>
            ) : null}

            {!isSearchMode && canLoadMore && !isFetchingNextPage ? (
              <div className={styles.loadMoreActionWrap}>
                <button
                  type="button"
                  className={styles.loadMoreButton}
                  onClick={() => {
                    setIsInfiniteTriggerLocked(true);
                    void fetchNextPage();
                  }}
                >
                  Load more
                </button>
              </div>
            ) : null}

            {!isSearchMode && !canLoadMore ? <div className={styles.endState}>You have reached the end of the catalog.</div> : null}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductPage;
