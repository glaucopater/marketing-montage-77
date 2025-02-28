
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

export interface Canvas {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

export interface PlacedProduct {
  id: string;
  productId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  initialWidth: number;
  initialHeight: number;
  zIndex: number;
  rotation: number; // Add rotation property (in degrees)
}

export interface Composition {
  id: string;
  canvasId: string;
  products: PlacedProduct[];
  createdAt: Date;
}
