import { CatalogProvider } from '@/features/catalog/catalog-context';
import { AuthProvider } from '@/features/auth';
import StorefrontApp from '@/components/storefront/StorefrontApp';

export default function HomePage() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <h1 className="sr-only">Burger King India online ordering</h1>
        <StorefrontApp />
      </CatalogProvider>
    </AuthProvider>
  );
}
