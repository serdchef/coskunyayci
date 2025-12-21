import { useEffect, useState } from 'react';

export interface RecentlyViewedProduct {
  id: string;
  sku: string;
  name: string;
  image: string;
  basePrice: number;
  viewedAt: number;
}

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
    setIsLoaded(true);
  }, []);

  // Add a product to recently viewed
  const addProduct = (product: RecentlyViewedProduct) => {
    try {
      const updated = [
        { ...product, viewedAt: Date.now() },
        ...recentlyViewed.filter(p => p.id !== product.id),
      ].slice(0, MAX_ITEMS);

      setRecentlyViewed(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recently viewed:', error);
    }
  };

  // Clear all
  const clear = () => {
    setRecentlyViewed([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    recentlyViewed,
    addProduct,
    clear,
    isLoaded,
  };
}
