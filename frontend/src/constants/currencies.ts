export const BASE_CURRENCY = "USD";

export const CURRENCY_STORAGE_KEY = "hotel-jr-currency";

// Sample rates against the US dollar, used until GET /currencies supplies live ones.
export const currencies = [
  { code: "USD", name: "US dollar", rate: 1 },
  { code: "EUR", name: "Euro", rate: 0.92 },
  { code: "GBP", name: "British pound", rate: 0.79 },
  { code: "AUD", name: "Australian dollar", rate: 1.52 },
  { code: "CAD", name: "Canadian dollar", rate: 1.37 },
  { code: "SGD", name: "Singapore dollar", rate: 1.34 },
  { code: "JPY", name: "Japanese yen", rate: 150 },
  { code: "INR", name: "Indian rupee", rate: 84 },
  { code: "AED", name: "UAE dirham", rate: 3.67 },
  { code: "ZAR", name: "South African rand", rate: 18 },
  { code: "KES", name: "Kenyan shilling", rate: 129 },
  { code: "NGN", name: "Nigerian naira", rate: 1600 },
] as const;
