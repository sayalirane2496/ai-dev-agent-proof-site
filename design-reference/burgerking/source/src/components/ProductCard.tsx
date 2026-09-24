import React from 'react';
import { Product } from '../types';
import { FoodTypeBadge } from './FoodTypeBadge';
import { Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onIncrement: (product: Product) => void;
  onDecrement: (product: Product) => void;
  onOpenCustomizer: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onIncrement,
  onDecrement,
  onOpenCustomizer,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E9E1D2] hover:border-[#D62300]/40 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Product Image Box with Zero-Broken-Image Fallback */}
        <div
          onClick={() => onOpenCustomizer(product)}
          className="relative aspect-[4/3] w-full bg-[#F4EEE4] overflow-hidden cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Scrim Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Veg / Non-Veg Indicator in Top Left */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded-md shadow-xs">
            <FoodTypeBadge isVeg={product.isVeg} size="sm" />
          </div>

          {/* Badge in Top Right */}
          {product.badge && (
            <div
              className={`absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider ${
                product.badge === 'Flame-Grilled'
                  ? 'bg-[#D62300] text-white'
                  : product.badge === 'Bestseller'
                  ? 'bg-[#FFB703] text-[#241812]'
                  : product.badge === 'Must Try'
                  ? 'bg-[#ED7117] text-white'
                  : 'bg-[#241812] text-white'
              }`}
            >
              {product.badge}
            </div>
          )}

          {/* Calorie Info Overlay on hover */}
          {product.calories && (
            <div className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/90 drop-shadow-sm">
              {product.calories}
            </div>
          )}
        </div>

        {/* Product Meta */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onOpenCustomizer(product)}
              className="font-display font-extrabold text-base sm:text-lg text-[#241812] group-hover:text-[#D62300] transition-colors line-clamp-1 cursor-pointer"
              title={product.name}
            >
              {product.name}
            </h3>

            {product.spiceLevel && product.spiceLevel > 1 && (
              <span className="text-xs text-[#D62300]" title="Spicy">
                {'🌶️'.repeat(product.spiceLevel)}
              </span>
            )}
          </div>

          <p className="text-xs text-[#59483F] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing and Action Section */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-[#F5EFE6] mt-1 flex items-center justify-between">
        <div className="pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-lg text-[#241812] tabular-nums">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Customization Link */}
          <button
            onClick={() => onOpenCustomizer(product)}
            className="text-[11px] font-bold text-[#D62300] hover:underline flex items-center gap-0.5 cursor-pointer pt-0.5"
          >
            <span>Customise</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* Morphing Add to Cart / Quantity Stepper */}
        <div className="pt-2">
          {quantityInCart === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="px-4 py-2 bg-white hover:bg-[#D62300] text-[#D62300] hover:text-white border-2 border-[#D62300] rounded-xl font-extrabold text-xs tracking-wider transition-all duration-200 shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#D62300] text-white rounded-xl shadow-xs overflow-hidden">
              <button
                onClick={() => onDecrement(product)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#B81D00] transition-colors cursor-pointer active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-7 text-center font-black text-xs tabular-nums select-none">
                {quantityInCart}
              </span>
              <button
                onClick={() => onIncrement(product)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#B81D00] transition-colors cursor-pointer active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
