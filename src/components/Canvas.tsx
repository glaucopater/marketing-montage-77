
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Canvas as CanvasType, PlacedProduct, Product } from "../utils/types";
import { generateId, getElementSize, isPositionWithinBounds } from "../utils/helpers";
import { products } from "../utils/data";

interface CanvasProps {
  canvas: CanvasType;
  placedProducts: PlacedProduct[];
  onProductPlacementChange: (updatedPlacement: PlacedProduct) => void;
  onProductRemove: (placementId: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  canvas,
  placedProducts,
  onProductPlacementChange,
  onProductRemove,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size on mount and window resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = getElementSize(canvasRef.current);
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((
    e: React.MouseEvent,
    placementId: string
  ) => {
    e.preventDefault();
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;

    const startX = e.clientX;
    const startY = e.clientY;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startLeft = placement.x;
    const startTop = placement.y;

    // Handlers for drag movement
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      
      const newX = startLeft + dx;
      const newY = startTop + dy;
      
      // Check if new position is within bounds
      if (canvasRef.current && isPositionWithinBounds(
        newX, 
        newY, 
        placement.width, 
        placement.height, 
        canvasSize.width, 
        canvasSize.height
      )) {
        onProductPlacementChange({
          ...placement,
          x: newX,
          y: newY,
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [placedProducts, canvasSize, onProductPlacementChange]);

  // Handle resize
  const handleResize = useCallback((
    e: React.MouseEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startX = e.clientX;
    const startWidth = placement.width;
    const aspectRatio = placement.initialHeight / placement.initialWidth;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const dx = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + dx); // Minimum width of 50px
      const newHeight = newWidth * aspectRatio;
      
      // Check if new size is within bounds
      if (canvasRef.current && isPositionWithinBounds(
        placement.x, 
        placement.y, 
        newWidth, 
        newHeight, 
        canvasSize.width, 
        canvasSize.height
      )) {
        onProductPlacementChange({
          ...placement,
          width: newWidth,
          height: newHeight,
        });
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [placedProducts, canvasSize, onProductPlacementChange]);

  // Handle double click to remove product
  const handleDoubleClick = useCallback((placementId: string) => {
    onProductRemove(placementId);
  }, [onProductRemove]);

  return (
    <div 
      ref={canvasRef}
      id="canvas-container"
      className="canvas-container border border-gray-200 rounded-lg shadow-md relative"
      style={{ backgroundImage: `url(${canvas.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {placedProducts.map((placement) => (
        <div
          id={`product-${placement.id}`}
          key={placement.id}
          className="draggable-product"
          style={{
            left: `${placement.x}px`,
            top: `${placement.y}px`,
            width: `${placement.width}px`,
            height: `${placement.height}px`,
            zIndex: placement.zIndex,
          }}
          onMouseDown={(e) => handleDragStart(e, placement.id)}
          onDoubleClick={() => handleDoubleClick(placement.id)}
        >
          <img
            src={products.find(p => p.id === placement.productId)?.image}
            alt="Product"
            className="w-full h-full object-contain"
            style={{ opacity: 0.75 }}
            draggable={false}
          />
          <div 
            className="resize-handle"
            onMouseDown={(e) => handleResize(e, placement.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Canvas;
