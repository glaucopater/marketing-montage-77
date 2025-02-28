
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
  rotation: number; // 2D rotation (in degrees)
  rotationX: number; // 3D rotation on X axis (in degrees)
  rotationY: number; // 3D rotation on Y axis (in degrees)
}

export interface Composition {
  id: string;
  canvasId: string;
  products: PlacedProduct[];
  createdAt: Date;
}
