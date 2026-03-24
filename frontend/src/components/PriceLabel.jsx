import React from 'react';

/**
 * PriceLabel – Shows a strikethrough original price alongside a bold discounted price.
 * If no originalPrice is provided, just shows the price normally.
 *
 * Props:
 *   price         {number}  – the current/discounted price (required)
 *   originalPrice {number}  – the old price to strike through (optional)
 *   size          {string}  – 'sm' | 'md' | 'lg'  (default: 'md')
 */
const PriceLabel = ({ price, originalPrice, size = 'md' }) => {
  const sizeMap = {
    sm: { original: 'text-sm', current: 'text-base' },
    md: { original: 'text-base', current: 'text-2xl' },
    lg: { original: 'text-lg', current: 'text-4xl' },
  };

  const { original: origSize, current: curSize } = sizeMap[size] || sizeMap.md;

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <span className="inline-flex items-center gap-2">
      {hasDiscount && (
        <span
          className={`${origSize} text-gray-400 font-medium line-through`}
          style={{ textDecorationColor: '#9ca3af' }}
        >
          ${originalPrice}
        </span>
      )}
      <span className={`${curSize} font-extrabold text-gray-900`}>
        ${price}
      </span>
      {hasDiscount && (
        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
        </span>
      )}
    </span>
  );
};

export default PriceLabel;
