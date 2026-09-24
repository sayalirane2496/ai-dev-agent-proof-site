'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Product, CartItem, SelectedCustomizations, RestaurantLocation, UserOrder, OfferDeal } from '@/lib/types';
import { INITIAL_ORDERS, PRODUCTS } from '@/features/catalog/mock-fallback';
import { useCatalog } from '@/features/catalog/catalog-context';
import { Header } from '@/components/storefront/Header';
import { MobileBottomNav } from '@/components/storefront/MobileBottomNav';
import { HeroSection } from '@/components/storefront/HeroSection';
import { FeaturedOffers } from '@/components/storefront/FeaturedOffers';
import { MenuSection } from '@/components/storefront/MenuSection';
import { SmartComboBuilder } from '@/components/storefront/SmartComboBuilder';
import { ProductCustomizerModal } from '@/components/storefront/ProductCustomizerModal';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { CheckoutModal } from '@/components/storefront/CheckoutModal';
import { OrderTrackingModal } from '@/components/storefront/OrderTrackingModal';
import { RestaurantFinder } from '@/components/storefront/RestaurantFinder';
import { RewardsDashboard } from '@/components/storefront/RewardsDashboard';
import { AppPromotion } from '@/components/storefront/AppPromotion';
import { Footer } from '@/components/storefront/Footer';
import { LocationModal } from '@/components/storefront/LocationModal';
import { SearchModal } from '@/components/storefront/SearchModal';
import { Check, X } from 'lucide-react';

export default function StorefrontApp() {
  const catalog = useCatalog();
  // Navigation & View State
  const [activeSection, setActiveSection] = useState<string>('home');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Location & Delivery Mode
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation>(catalog.restaurants[0] || {
    id: 'loc-andheri',
    name: 'Burger King — Andheri West',
    locality: 'Andheri West',
    city: 'Mumbai',
    distanceKm: 1.8,
    etaMin: '25–35 min',
    address: 'Andheri West',
    isOpen: true,
    timing: '10:00 AM – 3:00 AM',
    services: ['Delivery', 'Takeaway', 'Dine-In'],
    rating: 4.6,
    reviewsCount: 3820,
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [orderMode, setOrderMode] = useState<'delivery' | 'pickup'>('delivery');

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartItemId: 'init-1',
      productId: 'prod-whopper-chicken',
      productName: 'Chicken Whopper®',
      isVeg: false,
      basePrice: 219,
      unitPrice: 219,
      quantity: 1,
      image: PRODUCTS[1].image,
      customizations: {
        extraCheese: false,
        extraPatty: false,
        removedToppings: [],
        isMeal: false,
        mealFries: '',
        mealDrink: '',
      },
    },
    {
      cartItemId: 'init-2',
      productId: 'prod-peri-peri-fries',
      productName: 'King Peri Peri Fries',
      isVeg: true,
      basePrice: 119,
      unitPrice: 119,
      quantity: 1,
      image: PRODUCTS[7].image,
      customizations: {
        extraCheese: false,
        extraPatty: false,
        removedToppings: [],
        isMeal: false,
        mealFries: '',
        mealDrink: '',
      },
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>('KING50');

  // Modals State
  const [customizerProduct, setCustomizerProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState<UserOrder | null>(INITIAL_ORDERS[0]);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [pastOrders, setPastOrders] = useState<UserOrder[]>(INITIAL_ORDERS);
  const [quotedTotals, setQuotedTotals] = useState<{
    deliveryFee: number;
    taxes: number;
    discountAmount: number;
    totalAmount: number;
  } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cartItems]);

  const cartItemsCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartItemQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
    });
    return map;
  }, [cartItems]);

  // Delivery Fee: ₹35 if under ₹299, free if above or pickup
  const deliveryFee = quotedTotals?.deliveryFee ?? (orderMode === 'pickup' || cartItems.length === 0 ? 0 : cartSubtotal >= 299 ? 0 : 35);

  const taxes = quotedTotals?.taxes ?? Math.round(cartSubtotal * 0.05);

  const discountAmount = quotedTotals?.discountAmount ?? (() => {
    if (!appliedCouponCode || cartSubtotal === 0) return 0;
    if (appliedCouponCode === 'KING50') {
      return cartSubtotal >= 199 ? Math.min(100, Math.round(cartSubtotal * 0.5)) : 0;
    }
    if (appliedCouponCode === 'BOGO79') return 59;
    if (appliedCouponCode === 'MEALUP') return 99;
    if (appliedCouponCode === 'FEAST150') return cartSubtotal >= 499 ? 150 : 0;
    if (appliedCouponCode === 'SWEETKING') return cartSubtotal >= 299 ? 99 : 0;
    return 0;
  })();

  const totalAmount = quotedTotals?.totalAmount ?? Math.max(0, cartSubtotal + deliveryFee + taxes - discountAmount);

  useEffect(() => {
    if (cartItems.length === 0) {
      setQuotedTotals(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const response = await fetch('/api/v1/cart/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                customizations: item.customizations,
              })),
              couponCode: appliedCouponCode,
              fulfillmentType: orderMode,
              restaurantId: selectedLocation.id,
            }),
          });
          const json = await response.json();
          if (!cancelled && json.ok && json.data) {
            setQuotedTotals({
              deliveryFee: json.data.deliveryFee,
              taxes: json.data.taxes,
              discountAmount: json.data.discountAmount,
              totalAmount: json.data.totalAmount,
            });
          }
        } catch {
          /* keep last client estimate until a successful quote */
        }
      })();
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cartItems, appliedCouponCode, orderMode, selectedLocation.id]);

  // Handlers for Add To Cart & Quantity Adjustments
  const handleAddToCart = (product: Product) => {
    const existingIndex = cartItems.findIndex(
      (i) =>
        i.productId === product.id &&
        !i.customizations.extraCheese &&
        !i.customizations.extraPatty &&
        !i.customizations.isMeal &&
        !i.customizations.selectedSauce
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `item-${Date.now()}-${Math.random()}`,
        productId: product.id,
        productName: product.name,
        isVeg: product.isVeg,
        basePrice: product.price,
        unitPrice: product.price,
        quantity: 1,
        image: product.image,
        customizations: {
          extraCheese: false,
          extraPatty: false,
          removedToppings: [],
          isMeal: false,
          mealFries: '',
          mealDrink: '',
        },
      };
      setCartItems([...cartItems, newItem]);
    }
    showToast(`Added ${product.name} to your King cart!`);
  };

  const handleIncrement = (product: Product) => {
    handleAddToCart(product);
  };

  const handleDecrement = (product: Product) => {
    const existingIndex = cartItems.findIndex((i) => i.productId === product.id);
    if (existingIndex > -1) {
      const updated = [...cartItems];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex].quantity -= 1;
        setCartItems(updated);
      } else {
        updated.splice(existingIndex, 1);
        setCartItems(updated);
      }
    }
  };

  const handleCartItemIncrement = (cartItemId: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: Math.min(99, item.quantity + 1) }
          : item
      )
    );
  };

  const handleCartItemDecrement = (cartItemId: string) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCartItemRemove = (cartItemId: string) => {
    setCartItems(cartItems.filter((item) => item.cartItemId !== cartItemId));
  };

  // Customizer confirm
  const handleCustomizerConfirm = (
    product: Product,
    customizations: SelectedCustomizations,
    quantity: number
  ) => {
    let unitPrice = product.price;
    if (customizations.extraCheese) unitPrice += 25;
    if (customizations.extraPatty) unitPrice += 90;
    if (customizations.isMeal) unitPrice += 99;

    const newItem: CartItem = {
      cartItemId: `custom-${Date.now()}-${Math.random()}`,
      productId: product.id,
      productName: product.name,
      isVeg: product.isVeg,
      basePrice: product.price,
      unitPrice,
      quantity,
      image: product.image,
      customizations,
    };
    setCartItems([...cartItems, newItem]);
    showToast(`Customized ${product.name} added to cart!`);
  };

  // Combo Builder confirm
  const handleAddComboToCart = (
    burger: Product,
    friesName: string,
    drinkName: string,
    comboPrice: number
  ) => {
    const newItem: CartItem = {
      cartItemId: `combo-${Date.now()}`,
      productId: `combo-${burger.id}`,
      productName: `${burger.name} Royal Meal`,
      isVeg: burger.isVeg,
      basePrice: burger.price,
      unitPrice: comboPrice,
      quantity: 1,
      image: burger.image,
      customizations: {
        extraCheese: false,
        extraPatty: false,
        removedToppings: [],
        isMeal: true,
        mealFries: friesName,
        mealDrink: drinkName,
      },
    };
    setCartItems([...cartItems, newItem]);
    showToast(`Added ${burger.name} Royal Meal Combo!`);
    setIsCartOpen(true);
  };

  // Coupon apply
  const handleApplyCoupon = (offer: OfferDeal) => {
    setAppliedCouponCode(offer.code);
    showToast(`Promo Code ${offer.code} Applied! Saved on this order.`);
  };

  // Order Placement
  const handleOrderSuccess = (orderId: string, address: string, serverTotal?: number) => {
    const newOrder: UserOrder = {
      orderId,
      date: 'Just now',
      items: [...cartItems],
      totalAmount: serverTotal ?? totalAmount,
      status: 'Confirmed',
      restaurantName: selectedLocation.name,
      deliveryAddress: address,
      estimatedDeliveryTime: selectedLocation.etaMin,
      riderName: 'Ramesh K. (Valet)',
      riderPhone: '+91 98201 43210',
    };

    setPastOrders([newOrder, ...pastOrders]);
    setActiveTrackedOrder(newOrder);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsOrderTrackingOpen(true);
    showToast(`Order #${orderId} Confirmed! Tracking your rider now.`);
  };

  // Reorder
  const handleReorder = (pastOrder: UserOrder) => {
    setCartItems([...pastOrder.items]);
    setIsCartOpen(true);
    showToast(`Reordered ${pastOrder.items.length} items from Order #${pastOrder.orderId}`);
  };

  // Smooth scroll navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#241812] flex flex-col selection:bg-[#FFB703] selection:text-[#241812]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#241812] text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-bold">
          <div className="w-6 h-6 rounded-full bg-[#008738] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Sticky Navigation */}
      <Header
        selectedLocation={selectedLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemsCount={cartItemsCount}
        cartSubtotal={cartSubtotal}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onOrderNow={() => handleNavigate('menu')}
        onExploreMenu={() => handleNavigate('menu')}
        selectedLocation={selectedLocation}
        onOpenLocation={() => setIsLocationModalOpen(true)}
      />

      {/* Featured Offers */}
      <FeaturedOffers
        onApplyCoupon={handleApplyCoupon}
        appliedCouponCode={appliedCouponCode}
        offers={catalog.offers}
      />

      {/* Dedicated Menu Section */}
      <MenuSection
        onAddToCart={handleAddToCart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onOpenCustomizer={(p) => setCustomizerProduct(p)}
        cartItemQuantities={cartItemQuantities}
        searchQuery={menuSearchQuery}
        onSearchChange={setMenuSearchQuery}
        products={catalog.products}
        categories={catalog.categories}
      />

      {/* Smart Combo Builder */}
      <SmartComboBuilder
        onAddComboToCart={handleAddComboToCart}
        products={catalog.products}
        comboSides={catalog.comboSides}
      />

      {/* Restaurant Finder */}
      <RestaurantFinder
        onSelectRestaurant={(loc) => {
          setSelectedLocation(loc);
          showToast(`Now ordering from ${loc.name}`);
        }}
        currentSelectedId={selectedLocation.id}
        locations={catalog.restaurants}
      />

      {/* App Promotion & Download Banner */}
      <AppPromotion />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      {/* Mobile Sticky Bottom Bar */}
      <MobileBottomNav
        activeTab={activeSection}
        onNavigate={handleNavigate}
        cartCount={cartItemsCount}
        cartTotal={totalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
      />

      {/* Modals and Drawers */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => {
          setSelectedLocation(loc);
          showToast(`Delivery location set to ${loc.locality}, ${loc.city}`);
        }}
        orderMode={orderMode}
        onToggleOrderMode={setOrderMode}
        locations={catalog.restaurants}
      />

      <ProductCustomizerModal
        product={customizerProduct}
        isOpen={!!customizerProduct}
        onClose={() => setCustomizerProduct(null)}
        onConfirmAddToCart={handleCustomizerConfirm}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onIncrement={handleCartItemIncrement}
        onDecrement={handleCartItemDecrement}
        onRemove={handleCartItemRemove}
        onAddUpsell={handleAddToCart}
        upsellItems={catalog.upsells}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        taxes={taxes}
        discountAmount={discountAmount}
        totalAmount={totalAmount}
        appliedCoupon={appliedCouponCode}
        onApplyCouponCode={(code) => {
          setAppliedCouponCode(code);
          showToast(`Coupon ${code} Applied!`);
        }}
        onRemoveCoupon={() => {
          setAppliedCouponCode('');
          showToast('Coupon removed');
        }}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        taxes={taxes}
        discountAmount={discountAmount}
        totalAmount={totalAmount}
        selectedLocation={selectedLocation}
        orderMode={orderMode}
        couponCode={appliedCouponCode}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderTrackingModal
        order={activeTrackedOrder}
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />

      <RewardsDashboard
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        orders={pastOrders}
        onReorder={handleReorder}
        onTrackOrder={(ord) => {
          setActiveTrackedOrder(ord);
          setIsRewardsOpen(false);
          setIsOrderTrackingOpen(true);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCustomizer={(p) => {
          setCustomizerProduct(p);
          setIsSearchOpen(false);
        }}
        products={catalog.products}
      />
    </div>
  );
}
