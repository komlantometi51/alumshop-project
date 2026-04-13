'use client';

import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.produit.id);
      if (existing) {
        return state.map(i =>
          i.id === action.produit.id
            ? { ...i, quantite: i.quantite + 1 }
            : i
        );
      }
      return [...state, { ...action.produit, quantite: 1 }];
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantite: action.quantite } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const total = items.reduce((s, i) => s + i.prix_ht * i.quantite, 0);
  const count = items.reduce((s, i) => s + i.quantite, 0);

  return (
    <CartContext.Provider value={{ items, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
