import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Badge, Loader, Text } from '@mantine/core';
import { useProductDetail, useProductsByCategory } from '../infrastructure/product.hook';
import { ProductResult } from '../domain/product.type';
import Image from 'next/image';
import styles from './ProductDetail.page.module.scss';

const formatPrice = (value?: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

type ProductDetailPageProps = {
  initialProduct?: ProductResult.getDetailProduct;
  initialRecommended?: ProductResult.getProductsByCategory;
};

const ProductDetailPage = ({ initialProduct, initialRecommended }: ProductDetailPageProps) => {
  const router = useRouter();

  const productId = React.useMemo(() => {
    const rawId = router.query.id;
    if (!rawId) {
      return undefined;
    }

    const parsed = Number(Array.isArray(rawId) ? rawId[0] : rawId);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [router.query.id]);

  const { data, isLoading, isError } = useProductDetail(productId, initialProduct);
  const product = data?.data;

  const images = React.useMemo(() => {
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    if (product?.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id]);

  const hasImages = images.length > 0;
  const inStock = (product?.stock ?? 0) > 0;
  const productCategory = product?.category || 'uncategorized';
  const { data: recommendedData, isLoading: isRecommendedLoading } = useProductsByCategory(
    product?.category,
    {
      limit: 8,
      sortBy: 'rating',
      order: 'desc',
    },
    initialRecommended,
  );

  const recommendedProducts = React.useMemo(
    () => (recommendedData?.data ?? []).filter((item) => item.id !== product?.id).slice(0, 4),
    [product?.id, recommendedData?.data],
  );

  if (!router.isReady || isLoading) {
    return (
      <section className={styles.loadingWrapper}>
        <Loader color="dark" />
      </section>
    );
  }

  if (!productId || isError || !product) {
    return (
      <section className={styles.errorWrapper}>
        <Text className={styles.errorTitle}>Product not found</Text>
        <Text className={styles.errorSubtitle}>The product you are looking for is unavailable or the ID is invalid.</Text>
        <Link href="/" className={styles.backLink}>
          Back to catalog
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.breadcrumb}>
            <Link href="/" className={styles.backLink}>
              Catalog
            </Link>
            <span className={styles.breadcrumbSeparator}>/</span>
            <Text className={styles.breadcrumbCurrent}>{productCategory}</Text>
          </div>
          <Text className={styles.productId}>ID #{product.id}</Text>
        </div>

        <div className={styles.layout}>
          <div className={styles.galleryCard}>
            <div className={styles.mainImageWrap}>
              {hasImages ? (
                <Image
                  src={images[activeImageIndex]}
                  alt={product.title ?? 'Product image'}
                  className={styles.mainImage}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 56vw"
                />
              ) : (
                <div className={styles.noImage}>No image</div>
              )}

              {images.length > 1 ? (
                <>
                  <button
                    className={styles.imageNavButton}
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className={`${styles.imageNavButton} ${styles.imageNavButtonRight}`}
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              ) : null}

              {hasImages ? (
                <div className={styles.imageCounter}>
                  {activeImageIndex + 1} / {images.length}
                </div>
              ) : null}
            </div>

            {images.length > 1 ? (
              <div className={styles.thumbnailRow}>
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`${styles.thumbnailButton} ${index === activeImageIndex ? styles.thumbnailButtonActive : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Product thumbnail ${index + 1}`}
                      className={styles.thumbnailImage}
                      fill
                      sizes="(max-width: 767px) 25vw, (max-width: 1023px) 12vw, 8vw"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {images.length > 1 ? (
              <div className={styles.dotRow}>
                {images.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    type="button"
                    className={`${styles.dot} ${index === activeImageIndex ? styles.dotActive : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Select image ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.infoCard}>
            <div className={styles.badgeRow}>
              <Badge size="lg" radius="sm" color={inStock ? 'teal' : 'red'} variant="filled">
                {inStock ? `In Stock (${product.stock})` : 'Out of Stock'}
              </Badge>
              <Badge size="lg" radius="sm" color="gray" variant="light">
                {product.category || 'Uncategorized'}
              </Badge>
            </div>

            <Text className={styles.title}>{product.title}</Text>

            <div className={styles.metaRow}>
              {product.brand ? <Text className={styles.metaText}>Brand: {product.brand}</Text> : null}
              {product.rating ? <Text className={styles.metaText}>Rating: {product.rating.toFixed(1)} / 5</Text> : null}
              <Text className={styles.metaText}>Category: {productCategory}</Text>
            </div>

            <div className={styles.pricePanel}>
              <Text className={styles.priceLabel}>Price</Text>
              <Text className={styles.price}>${formatPrice(product.price)}</Text>
            </div>

            <Text className={styles.description}>{product.description}</Text>

            <div className={styles.policyPanel}>
              <Text className={styles.policyItem}>Secure checkout experience</Text>
              <Text className={styles.policyItem}>Fast shipping options available</Text>
              <Text className={styles.policyItem}>Trusted product guarantee</Text>
            </div>
          </div>
        </div>

        <section className={styles.recommendedSection}>
          <div className={styles.recommendedHeader}>
            <Text className={styles.recommendedTitle}>Recommended Products</Text>
            <Text className={styles.recommendedSubtitle}>More picks from the {productCategory} category</Text>
          </div>

          {isRecommendedLoading ? (
            <div className={styles.recommendedLoading}>
              <Loader size="sm" color="dark" />
              <Text>Loading recommendations...</Text>
            </div>
          ) : recommendedProducts.length === 0 ? (
            <div className={styles.recommendedEmpty}>No recommendations available right now.</div>
          ) : (
            <div className={styles.recommendedGrid}>
              {recommendedProducts.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className={styles.recommendedCard}>
                  <div className={styles.recommendedImageWrap}>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title ?? 'Recommended product image'}
                        className={styles.recommendedImage}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      />
                    ) : (
                      <div className={styles.noImage}>No image</div>
                    )}
                  </div>
                  <div className={styles.recommendedBody}>
                    <div className={styles.recommendedTopRow}>
                      <Badge size="sm" radius="sm" color="gray" variant="light">
                        {item.category || 'Uncategorized'}
                      </Badge>
                      <Text className={styles.recommendedCardPrice}>${formatPrice(item.price)}</Text>
                    </div>
                    <Text className={styles.recommendedCardTitle}>{item.title}</Text>
                    <Text className={styles.recommendedCardDescription}>{item.description}</Text>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default ProductDetailPage;
