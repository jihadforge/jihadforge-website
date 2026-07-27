"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { PRODUCTS, type ProductId } from "@/lib/products";

export type CartItem = {
  id: string;
  productId: ProductId;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image?: string;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (
    id: string,
    size: string,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function isProductId(value: string): value is ProductId {
  return value in PRODUCTS;
}

function restoreCart(savedCart: string): CartItem[] {
  const parsedCart: unknown = JSON.parse(savedCart);

  if (!Array.isArray(parsedCart)) {
    return [];
  }

  return parsedCart.flatMap((item): CartItem[] => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      !("name" in item) ||
      !("price" in item) ||
      !("size" in item) ||
      !("color" in item) ||
      !("quantity" in item)
    ) {
      return [];
    }

    const candidate = item as {
      id: unknown;
      productId?: unknown;
      name: unknown;
      price: unknown;
      size: unknown;
      color: unknown;
      quantity: unknown;
      image?: unknown;
    };

    if (
      typeof candidate.id !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.price !== "number" ||
      typeof candidate.size !== "string" ||
      typeof candidate.color !== "string" ||
      typeof candidate.quantity !== "number" ||
      candidate.quantity < 1
    ) {
      return [];
    }

    const possibleProductId =
      typeof candidate.productId === "string"
        ? candidate.productId
        : candidate.id;

    if (!isProductId(possibleProductId)) {
      return [];
    }

    const product = PRODUCTS[possibleProductId];

    return [
      {
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        size: candidate.size,
        color: candidate.color,
        quantity: Math.floor(candidate.quantity),
        image:
          typeof candidate.image === "string"
            ? candidate.image
            : product.image,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("jihadforge-cart");

      if (savedCart) {
        const restoredItems = restoreCart(savedCart);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(restoredItems);
      }
    } catch {
      localStorage.removeItem("jihadforge-cart");
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("jihadforge-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  function addItem(newItem: CartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
      }

      return [...currentItems, newItem];
    });
  }

  function removeItem(id: string, size: string, color: string) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size &&
            item.color === color
          )
      )
    );
  }

  function updateQuantity(
    id: string,
    size: string,
    color: string,
    quantity: number
  ) {
    if (quantity < 1) {
      removeItem(id, size, color);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id &&
        item.size === size &&
        item.color === color
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return context;
}