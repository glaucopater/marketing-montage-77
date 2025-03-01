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

  // Handle drag start (mouse)
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

  // Handle touch drag start for mobile
  const handleTouchStart = useCallback((
    e: React.TouchEvent,
    placementId: string
  ) => {
    if (e.touches.length !== 1) return; // Only handle single touch for dragging
    
    const touch = e.touches[0];
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;

    const startX = touch.clientX;
    const startY = touch.clientY;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startLeft = placement.x;
    const startTop = placement.y;

    // Store the initial touch time to detect potential double tap
    const touchStartTime = Date.now();
    let lastTouchTime = 0;
    let isDoubleTap = false;

    // Check if this is a double tap (for deletion on mobile)
    if (lastTouchTime && touchStartTime - lastTouchTime < 300) {
      isDoubleTap = true;
    }
    lastTouchTime = touchStartTime;

    // Handlers for touch movement
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      if (moveEvent.touches.length !== 1) return;
      const touchMove = moveEvent.touches[0];
      
      const dx = touchMove.clientX - startX;
      const dy = touchMove.clientY - startY;
      
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

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  }, [placedProducts, canvasSize, onProductPlacementChange]);

  // Handle resize (mouse)
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

  // Handle touch resize for mobile
  const handleTouchResize = useCallback((
    e: React.TouchEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startX = touch.clientX;
    const startWidth = placement.width;
    const aspectRatio = placement.initialHeight / placement.initialWidth;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      if (moveEvent.touches.length !== 1) return;
      const touchMove = moveEvent.touches[0];
      
      const dx = touchMove.clientX - startX;
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
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  }, [placedProducts, canvasSize, onProductPlacementChange]);

  // Handle Z rotation (2D plane rotation) - Mouse
  const handleRotate = useCallback((
    e: React.MouseEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  // Handle Z rotation (2D plane rotation) - Touch
  const handleTouchRotate = useCallback((
    e: React.TouchEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const rect = productElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get starting angle
    const startAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * 180 / Math.PI;
    const startRotation = placement.rotation || 0;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      if (moveEvent.touches.length !== 1) return;
      const touchMove = moveEvent.touches[0];
      
      const currentAngle = Math.atan2(touchMove.clientY - centerY, touchMove.clientX - centerX) * 180 / Math.PI;
      const angleDiff = currentAngle - startAngle;
      
      // Apply rotation (keeping it within 0-360 range)
      const newRotation = (startRotation + angleDiff + 360) % 360;
      
      onProductPlacementChange({
        ...placement,
        rotation: newRotation,
      });
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  }, [placedProducts, onProductPlacementChange]);

  // Handle X rotation (3D rotation around X axis) - Mouse
  const handleRotateX = useCallback((
    e: React.MouseEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startY = e.clientY;
    const startRotationX = placement.rotationX || 0;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const dy = moveEvent.clientY - startY;
      // Adjust the rotation sensitivity
      const newRotationX = (startRotationX - dy * 0.5 + 360) % 360;
      
      onProductPlacementChange({
        ...placement,
        rotationX: newRotationX,
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [placedProducts, onProductPlacementChange]);

  // Handle X rotation (3D rotation around X axis) - Touch
  const handleTouchRotateX = useCallback((
    e: React.TouchEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startY = touch.clientY;
    const startRotationX = placement.rotationX || 0;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      if (moveEvent.touches.length !== 1) return;
      const touchMove = moveEvent.touches[0];
      
      const dy = touchMove.clientY - startY;
      // Adjust the rotation sensitivity
      const newRotationX = (startRotationX - dy * 0.5 + 360) % 360;
      
      onProductPlacementChange({
        ...placement,
        rotationX: newRotationX,
      });
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  }, [placedProducts, onProductPlacementChange]);

  // Handle Y rotation (3D rotation around Y axis) - Mouse
  const handleRotateY = useCallback((
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
    const startRotationY = placement.rotationY || 0;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      const dx = moveEvent.clientX - startX;
      // Adjust the rotation sensitivity
      const newRotationY = (startRotationY + dx * 0.5 + 360) % 360;
      
      onProductPlacementChange({
        ...placement,
        rotationY: newRotationY,
      });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [placedProducts, onProductPlacementChange]);

  // Handle Y rotation (3D rotation around Y axis) - Touch
  const handleTouchRotateY = useCallback((
    e: React.TouchEvent,
    placementId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    
    const productElement = document.getElementById(`product-${placementId}`);
    if (!productElement) return;
    
    const placement = placedProducts.find(p => p.id === placementId);
    if (!placement) return;
    
    const startX = touch.clientX;
    const startRotationY = placement.rotationY || 0;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      
      if (moveEvent.touches.length !== 1) return;
      const touchMove = moveEvent.touches[0];
      
      const dx = touchMove.clientX - startX;
      // Adjust the rotation sensitivity
      const newRotationY = (startRotationY + dx * 0.5 + 360) % 360;
      
      onProductPlacementChange({
        ...placement,
        rotationY: newRotationY,
      });
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove, { passive: false });
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  }, [placedProducts, onProductPlacementChange]);

  return (
    <div 
      ref={canvasRef}
      id="canvas-container"
      className="canvas-container border border-gray-200 rounded-lg shadow-md relative"
      style={{ backgroundImage: `url(${canvas.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {placedProducts.map((placement) => {
        const rotationX = placement.rotationX || 0;
        const rotationY = placement.rotationY || 0;
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
              transform: `rotate(${placement.rotation || 0}deg) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
              transformStyle: 'preserve-3d',
              perspective: '800px',
            }}
            onMouseDown={(e) => handleDragStart(e, placement.id)}
            onTouchStart={(e) => handleTouchStart(e, placement.id)}
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
              onTouchStart={(e) => handleTouchResize(e, placement.id)}
            />
            {/* Z-axis rotation handle */}
            <div 
              className="rotate-handle"
              onMouseDown={(e) => handleRotate(e, placement.id)}
              onTouchStart={(e) => handleTouchRotate(e, placement.id)}
              title="Rotate Z-axis"
            />
            {/* X-axis rotation handle */}
            <div 
              className="rotate-x-handle"
              onMouseDown={(e) => handleRotateX(e, placement.id)}
              onTouchStart={(e) => handleTouchRotateX(e, placement.id)}
              title="Rotate X-axis"
            />
            {/* Y-axis rotation handle */}
            <div 
              className="rotate-y-handle"
              onMouseDown={(e) => handleRotateY(e, placement.id)}
              onTouchStart={(e) => handleTouchRotateY(e, placement.id)}
              title="Rotate Y-axis"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;
