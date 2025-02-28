
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
  
  // Log each render to see what's happening
  console.log("Canvas rendering, placedProducts:", placedProducts);

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

  // Handle rotation
  const handleRotate = useCallback((
    e: React.MouseEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Rotation started for product:", placementId);
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const rect = productElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get starting angle
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180 / Math.PI;
    const startRotation = placement.rotation || 0;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * 180 / Math.PI;
      const angleDiff = currentAngle - startAngle;
      
      // Apply rotation (keeping it within 0-360 range)
      const newRotation = (startRotation + angleDiff + 360) % 360;
      
      console.log("Rotating to:", newRotation);
      
      onProductPlacementChange({
        ...placement,
        rotation: newRotation,
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [placedProducts, onProductPlacementChange]);

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
      {placedProducts.map((placement) => {
        console.log("Rendering product:", placement.id, "with rotation:", placement.rotation);
        return (
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
              transform: `rotate(${placement.rotation || 0}deg)`,
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
            {/* Make sure this element is rendered and visible */}
            <div 
              className="rotate-handle"
              onMouseDown={(e) => handleRotate(e, placement.id)}
              style={{ backgroundColor: '#ef4444' }} // Ensure color is applied
            />
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
