'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CATEGORIES,
  OFFERS,
  POPULAR_LOCATIONS,
  PRODUCTS,
  UPSELL_ITEMS,
} from '@/features/catalog/mock-fallback';
import type { OfferDeal, Product, RestaurantLocation } from '@/lib/types';

export type ComboSide = {
  id: string;
  kind: 'fries' | 'drink';
  name: string;
  price_delta_inr: number;
  image_path: string | null;
  tag: string | null;
  is_hot: boolean;
};

type CatalogValue = {
  categories: { id: string; label: string; icon: string; count: number }[];
  products: Product[];
  restaurants: RestaurantLocation[];
  offers: OfferDeal[];
  upsells: Product[];
  comboSides: ComboSide[];
  loaded: boolean;
};

const fallback: CatalogValue = {
  categories: CATEGORIES,
  products: PRODUCTS,
  restaurants: POPULAR_LOCATIONS,
  offers: OFFERS,
  upsells: UPSELL_ITEMS,
  comboSides: [],
  loaded: false,
};

const CatalogContext = createContext<CatalogValue>(fallback);

export function useCatalog() {
  return useContext(CatalogContext);
}

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<CatalogValue>(fallback);

  useEffect(() => {
    fetch('/api/v1/catalog')
      .then((res) => res.json())
      .then((json) => {
        if (!json?.ok || !json.data?.products?.length) return;
        const products = json.data.products as Product[];
        const upsells = products.filter((p) =>
          ['prod-peri-peri-fries', 'prod-cold-coffee', 'prod-chocolate-mousse', 'prod-chicken-wings'].includes(p.id),
        );
        setValue({
          categories: json.data.categories?.length ? json.data.categories : CATEGORIES,
          products,
          restaurants: json.data.restaurants?.length ? json.data.restaurants : POPULAR_LOCATIONS,
          offers: json.data.offers?.length ? json.data.offers : OFFERS,
          upsells: upsells.length ? upsells : UPSELL_ITEMS,
          comboSides: json.data.comboSides ?? [],
          loaded: true,
        });
      })
      .catch(() => {
        setValue((prev) => ({ ...prev, loaded: true }));
      });
  }, []);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}
