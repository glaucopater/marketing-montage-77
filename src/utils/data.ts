
import { Canvas, Product } from "./types";

// Mock canvas backgrounds
export const canvases: Canvas[] = [
  {
    id: "canvas-1",
    name: "Modern Living Room",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&q=80&w=1000",
    description: "A minimalist living room with natural light",
    category: "interior"
  },
  {
    id: "canvas-2",
    name: "Kitchen Counter",
    image: "https://images.unsplash.com/photo-1556911220-bda9f7f6b548?auto=format&fit=crop&q=80&w=1000",
    description: "A clean modern kitchen counter",
    category: "interior"
  },
  {
    id: "canvas-3",
    name: "Office Desk",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000",
    description: "A productive workspace",
    category: "interior"
  },
  {
    id: "canvas-4",
    name: "Forest Path",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1000",
    description: "A serene path through the woods",
    category: "outdoor"
  },
  {
    id: "canvas-5",
    name: "Beach Scene",
    image: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&q=80&w=1000",
    description: "A peaceful beach at sunset",
    category: "outdoor"
  },
  {
    id: "canvas-6",
    name: "Modern Bathroom",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000",
    description: "A sleek bathroom design",
    category: "interior"
  }
];

// Mock products with transparent backgrounds
export const products: Product[] = [
  {
    id: "product-1",
    name: "Minimalist Water Bottle",
    image: "/bottle.svg",
    description: "A sleek, eco-friendly water bottle",
    category: "lifestyle"
  },
  {
    id: "product-2",
    name: "Smart Speaker",
    image: "/speaker.svg",
    description: "Voice-controlled smart speaker",
    category: "technology"
  },
  {
    id: "product-3",
    name: "Designer Chair",
    image: "/chair.svg",
    description: "Ergonomic designer chair",
    category: "furniture"
  },
  {
    id: "product-4",
    name: "Table Lamp",
    image: "/lamp.svg",
    description: "Modern table lamp with adjustable brightness",
    category: "furniture"
  },
  {
    id: "product-5",
    name: "Wireless Headphones",
    image: "/headphones.svg",
    description: "Noise-cancelling wireless headphones",
    category: "technology"
  },
  {
    id: "product-6",
    name: "Plant Pot",
    image: "/plant.svg",
    description: "Ceramic plant pot with minimalist design",
    category: "home decor"
  },
  {
    id: "product-7",
    name: "Coffee Mug",
    image: "/mug.svg",
    description: "Insulated coffee mug",
    category: "kitchenware"
  },
  {
    id: "product-8",
    name: "Notebook",
    image: "/notebook.svg",
    description: "Premium hardcover notebook",
    category: "stationery"
  }
];
