
import React from "react";
import { Product } from "../utils/types";

interface ProductItemProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onClick }) => {
  return (
    <div 
      className="product-item p-3 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-square mb-2 bg-gray-50 rounded flex items-center justify-center p-2">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
      <p className="text-xs text-gray-500 truncate">{product.description}</p>
    </div>
  );
};

export default ProductItem;
