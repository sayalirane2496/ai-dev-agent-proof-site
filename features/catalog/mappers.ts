import type { OfferDeal, Product, ProductCategory, RestaurantLocation } from '@/lib/types';

type ProductRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price_inr: number;
  original_price_inr: number | null;
  is_veg: boolean;
  badge: Product['badge'] | null;
  calories: string | null;
  spice_level: 0 | 1 | 2 | 3 | null;
  image_path: string;
  cheese_allowed: boolean;
  extra_patty_allowed: boolean;
  can_make_meal: boolean;
  is_combo_burger: boolean;
  is_upsell: boolean;
};

type OptionRow = {
  product_id: string;
  group_key: 'sauce' | 'size' | 'topping';
  name: string;
  price_delta_inr: number;
};

export function mapProduct(row: ProductRow, options: OptionRow[]): Product {
  const productOptions = options.filter((o) => o.product_id === row.id);
  return {
    id: row.id,
    name: row.name,
    category: row.category_id as ProductCategory,
    price: row.price_inr,
    originalPrice: row.original_price_inr ?? undefined,
    description: row.description,
    isVeg: row.is_veg,
    badge: row.badge ?? undefined,
    calories: row.calories ?? undefined,
    spiceLevel: row.spice_level ?? undefined,
    image: row.image_path,
    customizationOptions: {
      cheeseAllowed: row.cheese_allowed,
      extraPattyAllowed: row.extra_patty_allowed,
      canMakeMeal: row.can_make_meal,
      removableToppings: productOptions.filter((o) => o.group_key === 'topping').map((o) => o.name),
      sauces: productOptions
        .filter((o) => o.group_key === 'sauce')
        .map((o) => ({ name: o.name, price: o.price_delta_inr })),
      sizeOptions: productOptions
        .filter((o) => o.group_key === 'size')
        .map((o) => ({ name: o.name, priceDelta: o.price_delta_inr })),
    },
  };
}

export function mapRestaurant(row: {
  id: string;
  name: string;
  locality: string;
  city: string;
  distance_km: number;
  eta_min: string;
  address: string;
  is_open: boolean;
  timing: string;
  services: RestaurantLocation['services'];
  rating: number;
  reviews_count: number;
}): RestaurantLocation {
  return {
    id: row.id,
    name: row.name,
    locality: row.locality,
    city: row.city,
    distanceKm: Number(row.distance_km),
    etaMin: row.eta_min,
    address: row.address,
    isOpen: row.is_open,
    timing: row.timing,
    services: row.services,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
  };
}

export function mapOffer(row: {
  id: string;
  title: string;
  code: string;
  discount_badge: string;
  description: string;
  min_order_inr: number;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  category: OfferDeal['category'];
  image_path: string;
}): OfferDeal {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    discountBadge: row.discount_badge,
    description: row.description,
    minOrder: row.min_order_inr,
    discountType: row.discount_type,
    discountValue: row.discount_value,
    category: row.category,
    image: row.image_path,
  };
}
