'use client';
import { useEffect } from 'react';
import { useShop } from '@/store/shop';

// Empties the saved bag once, right after an order was placed.
export function ClearBagOnMount() {
  useEffect(() => { useShop.setState({ bag: {} }); }, []);
  return null;
}
