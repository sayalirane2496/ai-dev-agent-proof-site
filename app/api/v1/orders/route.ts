import { jsonError, jsonOk } from '@/lib/http';
import { createServerSupabase } from '@/lib/supabase/server';
import type { CartItem, UserOrder } from '@/lib/types';

function mapOrder(row: Record<string, unknown>, items: CartItem[]): UserOrder {
  const placed = row.placed_at ? new Date(String(row.placed_at)) : new Date();
  return {
    orderId: String(row.public_code),
    date: placed.toLocaleString('en-IN'),
    items,
    totalAmount: Number(row.total_inr),
    status: row.status as UserOrder['status'],
    restaurantName: String(row.restaurant_name || row.restaurant_id || ''),
    deliveryAddress: String(row.delivery_address || ''),
    estimatedDeliveryTime: String(row.eta_min || '25–35 min'),
    riderName: row.rider_name ? String(row.rider_name) : undefined,
    riderPhone: row.rider_phone ? String(row.rider_phone) : undefined,
  };
}

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonOk([]);
    }
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, restaurants(name, eta_min)')
      .eq('user_id', user.id)
      .order('placed_at', { ascending: false });
    if (error) return jsonError('ORDERS_ERROR', error.message, 400);
    const ids = (orders ?? []).map((o) => o.id);
    const { data: items } = ids.length
      ? await supabase.from('order_items').select('*').in('order_id', ids)
      : { data: [] };
    const mapped = (orders ?? []).map((order) => {
      const orderItems = (items ?? [])
        .filter((item) => item.order_id === order.id)
        .map((item) => ({
          cartItemId: item.id,
          productId: item.product_id,
          productName: item.product_name,
          isVeg: item.is_veg,
          basePrice: item.unit_price_inr,
          unitPrice: item.unit_price_inr,
          quantity: item.quantity,
          image: item.image_path,
          customizations: item.customizations,
        }));
      const restaurant = order.restaurants as { name?: string; eta_min?: string } | null;
      return mapOrder(
        {
          ...order,
          restaurant_name: restaurant?.name,
          eta_min: restaurant?.eta_min,
        },
        orderItems,
      );
    });
    return jsonOk(mapped);
  } catch (error) {
    return jsonError('ORDERS_ERROR', error instanceof Error ? error.message : 'Failed', 500);
  }
}
