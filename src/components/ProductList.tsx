
import React, { useState } from "react";
import { Product } from "../utils/types";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Products
        </label>
        <input
          type="text"
          id="search"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          placeholder="Search by name, description or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredProducts.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No products found.</p>
      ) : (
        <div className="product-list-container pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onClick={onProductSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
