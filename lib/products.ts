export const PRODUCTS = {
  "awrah-forge-shorts": {
    id: "awrah-forge-shorts",
    name: "Awrah Forge Shorts",
    price: 34.99,
    image: "/jihadforge-logo.png",
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;