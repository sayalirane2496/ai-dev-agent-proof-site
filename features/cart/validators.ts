import type { SelectedCustomizations } from '@/lib/types';

export type CartPayloadItem = {
  productId: string;
  quantity: number;
  customizations?: Partial<SelectedCustomizations>;
};

export type QuotePayload = {
  items: CartPayloadItem[];
  couponCode?: string;
  fulfillmentType?: 'delivery' | 'pickup';
  restaurantId?: string;
};

function asCustomizations(value: unknown): Partial<SelectedCustomizations> {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const c = value as Record<string, unknown>;
  return {
    extraCheese: Boolean(c.extraCheese),
    extraPatty: Boolean(c.extraPatty),
    removedToppings: Array.isArray(c.removedToppings) ? c.removedToppings.map(String) : [],
    selectedSauce: typeof c.selectedSauce === 'string' ? c.selectedSauce : undefined,
    selectedSize: typeof c.selectedSize === 'string' ? c.selectedSize : undefined,
    isMeal: Boolean(c.isMeal),
    mealFries: typeof c.mealFries === 'string' ? c.mealFries : '',
    mealDrink: typeof c.mealDrink === 'string' ? c.mealDrink : '',
  };
}

export function parseQuotePayload(body: unknown): QuotePayload {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid payload');
  }
  const raw = body as Record<string, unknown>;
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items: CartPayloadItem[] = [];
  for (const item of itemsRaw) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const productId = String(row.productId || '').trim();
    if (!productId) {
      throw new Error('Product is required');
    }
    const quantity = Number(row.quantity ?? 1);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error('Quantity must be between 1 and 99');
    }
    items.push({
      productId,
      quantity,
      customizations: asCustomizations(row.customizations),
    });
  }

  return {
    items,
    couponCode: typeof raw.couponCode === 'string' ? raw.couponCode : '',
    fulfillmentType: raw.fulfillmentType === 'pickup' ? 'pickup' : 'delivery',
    restaurantId: typeof raw.restaurantId === 'string' ? raw.restaurantId : 'loc-andheri',
  };
}
