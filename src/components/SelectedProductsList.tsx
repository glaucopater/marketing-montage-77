
import React from "react";
import { PlacedProduct } from "../utils/types";
import { products } from "../utils/data";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface SelectedProductsListProps {
  placedProducts: PlacedProduct[];
  onRemoveProduct: (productId: string) => void;
}

const SelectedProductsList: React.FC<SelectedProductsListProps> = ({
  placedProducts,
  onRemoveProduct,
}) => {
  if (placedProducts.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        No products selected
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {placedProducts.map((placement) => {
        const product = products.find((p) => p.id === placement.productId);
        if (!product) return null;

        return (
          <div
            key={placement.id}
            className="flex items-center justify-between bg-white rounded-lg p-2 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <div className="text-xs text-gray-500">
                  {Math.round(placement.rotation || 0)}° rotation
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-destructive"
              onClick={() => onRemoveProduct(placement.id)}
            >
              <XIcon size={16} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedProductsList;
