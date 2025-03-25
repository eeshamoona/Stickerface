/**
 * Game logic functions for the Lemonomics Sticker component
 */

import {
  animalNames,
  customerTypes,
  MAX_CUSTOMERS,
  MAX_PRICE,
  MIN_CUSTOMERS,
  MIN_PRICE,
} from "./constants";
import { Customer } from "./types";

/**
 * Generates a list of customers for the game day
 */
export const generateCustomers = (basePrice: number): Customer[] => {
  const customers: Customer[] = [];
  // Random number of customers between MIN_CUSTOMERS and MAX_CUSTOMERS
  const customerCount =
    Math.floor(Math.random() * (MAX_CUSTOMERS - MIN_CUSTOMERS + 1)) +
    MIN_CUSTOMERS;

  // Create a balanced mix of customer types
  // This ensures we have a good distribution of price expectations
  const availableTypes = [...customerTypes];

  // Calculate the possible expected price options based on base price
  const baseForCalculation = basePrice > 0 ? basePrice : MIN_PRICE;

  // These are the exact same options used in the price selector
  const possiblePriceOptions = [
    Math.max(MIN_PRICE, baseForCalculation - 0.5),
    Math.max(MIN_PRICE, baseForCalculation - 0.25),
    baseForCalculation,
    Math.min(MAX_PRICE, baseForCalculation + 0.25),
    Math.min(MAX_PRICE, baseForCalculation + 0.5),
  ];

  for (let i = 0; i < customerCount; i++) {
    // For better distribution, select customer types with weighted probability
    // This ensures a more balanced mix of customer expectations
    let customerType;

    if (i < 2) {
      // First couple of customers are more likely to be average or thrifty
      // This gives players a gentler start
      const easyTypes = availableTypes.filter(
        (t) => t.type === "average" || t.type === "thrifty" || t.type === "kid"
      );
      customerType = easyTypes[Math.floor(Math.random() * easyTypes.length)];
    } else if (i >= customerCount - 3) {
      // Last few customers are more likely to be premium customers
      // This creates a difficulty curve
      const premiumTypes = availableTypes.filter(
        (t) =>
          t.type === "generous" ||
          t.type === "enthusiast" ||
          t.type === "connoisseur"
      );
      customerType =
        premiumTypes[Math.floor(Math.random() * premiumTypes.length)];
    } else {
      // Middle customers are completely random
      customerType =
        availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }

    const name = animalNames[Math.floor(Math.random() * animalNames.length)];

    // Select one of the 5 price options based on customer type
    // Use the customer's price multiplier to bias the selection toward appropriate prices
    // This ensures the expected price is ALWAYS one of the 5 options shown to the player
    let priceIndex;

    if (customerType.priceMultiplier <= 0.8) {
      // Thrifty customers - bias toward lower prices
      priceIndex = Math.floor(Math.random() * 3); // Indexes 0-2 (lower 3 prices)
    } else if (customerType.priceMultiplier >= 1.2) {
      // Premium customers - bias toward higher prices
      priceIndex = 2 + Math.floor(Math.random() * 3); // Indexes 2-4 (higher 3 prices)
    } else {
      // Average customers - could expect any price but with middle bias
      priceIndex = 1 + Math.floor(Math.random() * 3); // Indexes 1-3 (middle 3 prices)
    }

    // Ensure index is within bounds
    priceIndex = Math.min(
      Math.max(priceIndex, 0),
      possiblePriceOptions.length - 1
    );

    // Set the expected price to be exactly one of the 5 options
    const expectedPrice = possiblePriceOptions[priceIndex];

    customers.push({
      ...customerType,
      id: `customer-${i}`,
      name,
      expectedPrice,
      actualPaid: 0,
      rating: 0,
      served: false,
    });
  }
  return customers;
};

/**
 * Calculates the customer rating based on price difference
 */
export const calculateRating = (
  price: number,
  expectedPrice: number
): number => {
  let rating = 5; // Default rating (exact match)
  const priceDifference = expectedPrice - price; //Can we +- 0.25 or +- 0.5 or 0
  // If the price is the same or lower than expected, the rating is 5, otherwise reduce 1 star for
  // each 0.25 that the price is higher than expected
  const priceDifferenceRatio = Math.abs(priceDifference) / expectedPrice;

  if (priceDifference > 0) {
    return rating;
  } else if (priceDifference == -0.25) {
    rating = 4;
  } else if (priceDifference == -0.5) {
    rating = 3;
  } else if (priceDifference == -0.75) {
    rating = 2;
  } else if (priceDifference == -1) {
    rating = 1;
  }
  return rating;
};

/**
 * Determines if the customer buys based on price difference and customer type
 */
export const determineCustomerBuys = (
  price: number,
  customer: Customer
): boolean => {
  // Determine if the customer buys based on price difference
  // If price is too high compared to expected price, customer might walk away
  // Different customer types have different price tolerances
  let maxPriceRatio = 1.5; // Default tolerance

  // Adjust tolerance based on customer type
  if (customer.type === "thrifty" || customer.type === "kid") {
    maxPriceRatio = 1.3; // More price sensitive
  } else if (customer.type === "enthusiast" || customer.type === "generous") {
    maxPriceRatio = 1.7; // Less price sensitive
  } else if (customer.type === "connoisseur") {
    maxPriceRatio = 2.0; // Willing to pay a premium for quality
  }

  const priceToleranceRatio = price / customer.expectedPrice;
  return priceToleranceRatio <= maxPriceRatio;
};

/**
 * Generates price options based on the base price
 * It should be the base price, +0.25, +0.5, -0.25, -0.5
 */
export const generatePriceOptions = (basePrice: number): number[] => {
  // Generate price options around the base price
  // These must match the same options used in generateCustomers
  const baseForCalculation = basePrice > 0 ? basePrice : MIN_PRICE;

  const possiblePriceOptions = [
    Math.max(MIN_PRICE, baseForCalculation - 0.5),
    Math.max(MIN_PRICE, baseForCalculation - 0.25),
    baseForCalculation,
    Math.min(MAX_PRICE, baseForCalculation + 0.25),
    Math.min(MAX_PRICE, baseForCalculation + 0.5),
  ];
  return possiblePriceOptions;
};

/**
 * Generates a list of base price options for selection
 */
export const generateBasePriceOptions = (): number[] => {
  // Price options from MIN_PRICE to MAX_PRICE
  return [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
};
