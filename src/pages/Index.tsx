
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductList from "@/components/ProductList";
import Canvas from "@/components/Canvas";
import { 
  canvases, 
  products 
} from "@/utils/data";
import { 
  Canvas as CanvasType, 
  Composition, 
  PlacedProduct, 
  Product 
} from "@/utils/types";
import { 
  captureCanvas, 
  downloadImage, 
  generateId, 
  saveComposition 
} from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const Index: React.FC = () => {
  const { toast } = useToast();
  const [selectedCanvas, setSelectedCanvas] = useState<CanvasType>(canvases[0]);
  const [placedProducts, setPlacedProducts] = useState<PlacedProduct[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  // Update canvas size when component mounts
  useEffect(() => {
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      setCanvasSize({
        width: canvasContainer.clientWidth,
        height: canvasContainer.clientHeight,
      });
    }
  }, [selectedCanvas]);

  // Handle canvas change
  const handleCanvasChange = (canvasId: string) => {
    const canvas = canvases.find((c) => c.id === canvasId);
    if (canvas) {
      setSelectedCanvas(canvas);
      
      // Reset placed products when canvas changes
      setPlacedProducts([]);
      
      toast({
        title: "Canvas Changed",
        description: `You're now using the "${canvas.name}" canvas.`,
      });
    }
  };

  // Handle adding a product to the canvas
  const handleProductSelect = useCallback((product: Product) => {
    if (placedProducts.length >= 3) {
      toast({
        title: "Maximum Products Reached",
        description: "You can only add up to 3 products to the canvas.",
        variant: "destructive",
      });
      return;
    }

    // Create a new placement with default position and size
    const defaultWidth = 100;
    const aspectRatio = 1; // Most SVG products have 1:1 aspect ratio
    
    const newPlacement: PlacedProduct = {
      id: generateId(),
      productId: product.id,
      x: Math.random() * (canvasSize.width - defaultWidth),
      y: Math.random() * (canvasSize.height - defaultWidth * aspectRatio),
      width: defaultWidth,
      height: defaultWidth * aspectRatio,
      initialWidth: defaultWidth,
      initialHeight: defaultWidth * aspectRatio,
      zIndex: placedProducts.length + 1,
    };

    setPlacedProducts([...placedProducts, newPlacement]);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added to the canvas.`,
    });
  }, [placedProducts, canvasSize, toast]);

  // Handle product placement updates
  const handleProductPlacementChange = useCallback((updatedPlacement: PlacedProduct) => {
    setPlacedProducts((prev) =>
      prev.map((p) => (p.id === updatedPlacement.id ? updatedPlacement : p))
    );
  }, []);

  // Handle product removal
  const handleProductRemove = useCallback((placementId: string) => {
    setPlacedProducts((prev) => prev.filter((p) => p.id !== placementId));
    
    toast({
      title: "Product Removed",
      description: "The product has been removed from the canvas.",
    });
  }, [toast]);

  // Handle composition download
  const handleDownload = async () => {
    if (placedProducts.length === 0) {
      toast({
        title: "No Products",
        description: "Please add at least one product to the canvas before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      
      // Get the canvas element
      const canvasElement = document.getElementById("canvas-container");
      if (!canvasElement) {
        throw new Error("Canvas element not found");
      }

      // Capture the canvas as an image
      const dataUrl = await captureCanvas(canvasElement);
      
      // Download the image
      downloadImage(dataUrl, `marketing-montage-${new Date().getTime()}.png`);
      
      // Save the composition metadata
      const composition: Composition = {
        id: generateId(),
        canvasId: selectedCanvas.id,
        products: placedProducts,
        createdAt: new Date(),
      };
      saveComposition(composition);
      
      toast({
        title: "Composition Saved",
        description: "Your composition has been downloaded and saved.",
      });
    } catch (error) {
      console.error("Error downloading composition:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your composition.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Canvas</h2>
                  <div className="w-40">
                    <Select
                      value={selectedCanvas.id}
                      onValueChange={handleCanvasChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a canvas" />
                      </SelectTrigger>
                      <SelectContent>
                        {canvases.map((canvas) => (
                          <SelectItem key={canvas.id} value={canvas.id}>
                            {canvas.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Canvas
                  canvas={selectedCanvas}
                  placedProducts={placedProducts}
                  onProductPlacementChange={handleProductPlacementChange}
                  onProductRemove={handleProductRemove}
                />
                
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Products: {placedProducts.length}/3
                  </p>
                  <Button 
                    onClick={handleDownload}
                    disabled={placedProducts.length === 0 || isDownloading}
                  >
                    {isDownloading ? "Processing..." : "Download Composition"}
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Instructions</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">1</span>
                    Select a background canvas from the dropdown menu.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">2</span>
                    Browse and click on products to add them to your canvas (max 3).
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">3</span>
                    Drag products to position them on the canvas.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">4</span>
                    Use the resize handle (bottom-right corner) to resize products.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">5</span>
                    Double-click on a product to remove it from the canvas.
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium mr-2">6</span>
                    Click "Download Composition" when you're satisfied with your design.
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className="sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Products</h2>
                <ProductList 
                  products={products} 
                  onProductSelect={handleProductSelect} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
