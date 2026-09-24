/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Product, CartItem, SelectedCustomizations, RestaurantLocation, UserOrder, OfferDeal } from './types';
import { POPULAR_LOCATIONS, INITIAL_ORDERS, PRODUCTS } from './data/mockData';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { FeaturedOffers } from './components/FeaturedOffers';
import { MenuSection } from './components/MenuSection';
import { SmartComboBuilder } from './components/SmartComboBuilder';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RestaurantFinder } from './components/RestaurantFinder';
import { RewardsDashboard } from './components/RewardsDashboard';
import { AppPromotion } from './components/AppPromotion';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { SearchModal } from './components/SearchModal';
import { Check, Flame, ShoppingBag, X } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeSection, setActiveSection] = useState<string>('home');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');

  // Location & Delivery Mode
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation>(POPULAR_LOCATIONS[0]);
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
  const deliveryFee = useMemo(() => {
    if (orderMode === 'pickup' || cartItems.length === 0) return 0;
    return cartSubtotal >= 299 ? 0 : 35;
  }, [orderMode, cartSubtotal, cartItems]);

  // Indian GST (5%)
  const taxes = useMemo(() => {
    return Math.round(cartSubtotal * 0.05);
  }, [cartSubtotal]);

  // Coupon Discount
  const discountAmount = useMemo(() => {
    if (!appliedCouponCode || cartSubtotal === 0) return 0;
    if (appliedCouponCode === 'KING50') {
      return cartSubtotal >= 199 ? Math.min(100, Math.round(cartSubtotal * 0.5)) : 0;
    }
    if (appliedCouponCode === 'BOGO79') {
      return 59;
    }
    if (appliedCouponCode === 'MEALUP') {
      return 99;
    }
    if (appliedCouponCode === 'FEAST150') {
      return cartSubtotal >= 499 ? 150 : 0;
    }
    if (appliedCouponCode === 'SWEETKING') {
      return cartSubtotal >= 299 ? 99 : 0;
    }
    return 0;
  }, [appliedCouponCode, cartSubtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, cartSubtotal + deliveryFee + taxes - discountAmount);
  }, [cartSubtotal, deliveryFee, taxes, discountAmount]);

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
        item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
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
  const handleOrderSuccess = (orderId: string, address: string) => {
    const newOrder: UserOrder = {
      orderId,
      date: 'Just now',
      items: [...cartItems],
      totalAmount,
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
      />

      {/* Smart Combo Builder */}
      <SmartComboBuilder onAddComboToCart={handleAddComboToCart} />

      {/* Restaurant Finder */}
      <RestaurantFinder
        onSelectRestaurant={(loc) => {
          setSelectedLocation(loc);
          showToast(`Now ordering from ${loc.name}`);
        }}
        currentSelectedId={selectedLocation.id}
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
      />
    </div>
  );
}
