import { CatalogProvider } from '@/features/catalog/catalog-context';
import StorefrontApp from '@/components/storefront/StorefrontApp';

export default function HomePage() {
  return (
    <CatalogProvider>
      <h1 className="sr-only">Burger King India online ordering</h1>
      <StorefrontApp />
    </CatalogProvider>
  );
}
