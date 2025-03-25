/**
 * Types for the Lemonomics Sticker component
 */

export interface Customer {
  id: string;
  name: string;
  type: string;
  expectedPrice: number;
  emoji: string;
  thought: string;
  actualPaid: number;
  rating: number;
  served: boolean;
}

export interface GameState {
  currentDay: number;
  totalProfit: number;
  averageRating: number;
  currentCustomerIndex: number;
  customers: Customer[];
  currentCustomer: Customer | null;
  dailyProfit: number;
  dailyRatings: number[];
  priceHistory: number[];
  basePrice: number;
  showPriceSelection: boolean;
}

export interface LifetimeStats {
  daysPlayed: number;
  lifetimeProfit: number;
}

export interface TransactionResult {
  customerName: string;
  customerEmoji: string;
  price: number;
  expectedPrice: number;
  profit: number;
  rating: number;
  buys: boolean;
}

export interface CustomerType {
  type: string;
  priceMultiplier: number;
  emoji: string;
  thought: string;
}
