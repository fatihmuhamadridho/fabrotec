import React from 'react';
import { useInfiniteProducts, useProductCategories, useProductSearch } from '../infrastructure/product.hook';
import { Badge, Loader, Select, Text, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import Link from 'next/link';
import Image from 'next/image';
import { ProductResult } from '../domain/product.type';
import styles from './Product.page.module.scss';

const formatPrice = (value?: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

type ProductPageProps = {
  initialProducts?: ProductResult.getAllProduct;
  initialCategories?: ProductResult.getAllCategories;
};

const ProductPage = ({ initialProducts, initialCategories }: ProductPageProps) => {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteProducts(undefined, 12, initialProducts);
  const { data: categoriesData } = useProductCategories(initialCategories);
  const [searchKeyword, setSearchKeyword] = React.useState<string>('');
  const [debouncedSearchKeyword] = useDebouncedValue(searchKeyword.trim(), 350);
  const { data: searchData, isFetching: isSearchFetching } = useProductSearch(debouncedSearchKeyword);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortByPrice, setSortByPrice] = React.useState<string>('none');
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);
  const isSearchMode = debouncedSearchKeyword.length > 0;

  const products = React.useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);
  const totalProducts = React.useMemo(() => {
    if (isSearchMode) {
      return searchData?.meta?.total ?? searchData?.data.length ?? 0;
    }
    return data?.pages?.[0]?.meta?.total ?? products.length;
  }, [data?.pages, isSearchMode, products.length, searchData?.data.length, searchData?.meta?.total]);

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

  const sourceProducts = isSearchMode ? (searchData?.data ?? []) : products;

  const visibleProducts = React.useMemo(() => {
    const filtered = sourceProducts.filter((product) => selectedCategory === 'all' || product.category === selectedCategory);

    if (sortByPrice === 'asc') {
      return [...filtered].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (sortByPrice === 'desc') {
      return [...filtered].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    return filtered;
  }, [selectedCategory, sortByPrice, sourceProducts]);

  React.useEffect(() => {
    if (isSearchMode) {
      return;
    }

    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchMode]);

  if (isLoading && !isSearchMode) {
    return (
      <section className={styles.loadingWrapper}>
        <Loader color="dark" />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.backgroundGlowTop} />
      <div className={styles.backgroundGlowBottom} />

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

        {visibleProducts.length === 0 ? (
          <div className={styles.emptyState}>No products found for this filter.</div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className={styles.productCard}>
                  <div className={styles.cardImageWrap}>
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title ?? 'Product image'}
                        className={styles.cardImage}
                        fill
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

            {!isSearchMode && !hasNextPage ? <div className={styles.endState}>You have reached the end of the catalog.</div> : null}
          </>
        )}
      </div>
    </section>
  );
};

export default ProductPage;
