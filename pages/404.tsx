import Link from 'next/link';
import { Text } from '@mantine/core';
import styles from '@styles/not-found.module.scss';

export default function NotFoundPage() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <Text className={styles.code}>404</Text>
        <Text className={styles.title}>Page not found</Text>
        <Text className={styles.description}>The page you are looking for does not exist or has been moved.</Text>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Back to catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
