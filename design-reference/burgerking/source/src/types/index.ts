export type ProductCategory =
  | 'all'
  | 'bestsellers'
  | 'whopper'
  | 'burgers-wraps'
  | 'king-premium'
  | 'chicken'
  | 'veg'
  | 'sides'
  | 'beverages'
  | 'desserts'
  | 'bk-cafe'
  | 'combos'
  | 'value-meals';

export interface ProductCustomizationOptions {
  cheeseAllowed?: boolean;
  extraPattyAllowed?: boolean;
  removableToppings?: string[];
  sauces?: { name: string; price: number }[];
  sizeOptions?: { name: string; priceDelta: number }[];
  canMakeMeal?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  description: string;
  isVeg: boolean;
  badge?: 'Bestseller' | 'Flame-Grilled' | 'Must Try' | 'New' | 'Value' | 'Chef Pick';
  calories?: string;
  spiceLevel?: 0 | 1 | 2 | 3;
  image: string;
  customizationOptions: ProductCustomizationOptions;
}

export interface SelectedCustomizations {
  extraCheese: boolean;
  extraPatty: boolean;
  removedToppings: string[];
  selectedSauce?: string;
  selectedSize?: string;
  isMeal: boolean;
  mealFries: string;
  mealDrink: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  isVeg: boolean;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  image: string;
  customizations: SelectedCustomizations;
}

export interface OfferDeal {
  id: string;
  title: string;
  code: string;
  discountBadge: string;
  description: string;
  minOrder: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  category: 'all' | 'under99' | 'meals' | 'burgers' | 'family' | 'exclusive';
  image: string;
}

export interface RestaurantLocation {
  id: string;
  name: string;
  locality: string;
  city: string;
  distanceKm: number;
  etaMin: string;
  address: string;
  isOpen: boolean;
  timing: string;
  services: ('Delivery' | 'Takeaway' | 'Dine-In' | 'Drive-Thru')[];
  rating: number;
  reviewsCount: number;
}

export interface UserOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Confirmed' | 'Grilling' | 'Out for Delivery' | 'Delivered';
  restaurantName: string;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  riderName?: string;
  riderPhone?: string;
}
