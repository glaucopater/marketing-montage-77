
import html2canvas from "html2canvas";
import { Composition, PlacedProduct } from "./types";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getElementSize = (element: HTMLElement): { width: number; height: number } => {
  return {
    width: element.clientWidth,
    height: element.clientHeight,
  };
};

export const saveComposition = (composition: Composition): void => {
  const compositions = getSavedCompositions();
  compositions.push(composition);
  localStorage.setItem("compositions", JSON.stringify(compositions));
};

export const getSavedCompositions = (): Composition[] => {
  const compositionsString = localStorage.getItem("compositions");
  if (!compositionsString) {
    return [];
  }
  return JSON.parse(compositionsString);
};

export const captureCanvas = async (canvasElement: HTMLElement): Promise<string> => {
  try {
    // Configure html2canvas options
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: null,
      useCORS: true,
      scale: 2,
      logging: false,
    });
    
    // Convert canvas to data URL (PNG format)
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error capturing canvas:", error);
    throw error;
  }
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateScaledDimensions = (
  originalWidth: number,
  originalHeight: number,
  newWidth: number
): { width: number; height: number } => {
  const aspectRatio = originalHeight / originalWidth;
  const newHeight = newWidth * aspectRatio;
  return { width: newWidth, height: newHeight };
};

export const isPositionWithinBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number
): boolean => {
  return x >= 0 && y >= 0 && x + width <= containerWidth && y + height <= containerHeight;
};

export const getProductByPlacement = (
  placedProduct: PlacedProduct,
  products: any[]
): any | undefined => {
  return products.find((p) => p.id === placedProduct.productId);
};
