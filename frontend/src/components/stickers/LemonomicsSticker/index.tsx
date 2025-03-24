"use client";

/**
 * LemonomicsSticker.tsx
 *
 * A browser-based lemonade stand business simulation game with a focus on clean,
 * interactive user experience and engaging game mechanics.
 *
 * Key Features:
 *   1) Price selection with slider and preset buttons
 *   2) Customer interactions with thought bubbles
 *   3) Dynamic pricing negotiations
 *   4) Daily stats tracking and star ratings
 *
 * Dependencies:
 *   - React w/ Hooks
 *   - Tailwind CSS for styling
 */

import React, { useEffect, useState } from "react";

// Import types
import { GameState, LifetimeStats, TransactionResult } from "./types";

// Import constants
import { DAYS_PLAYED_KEY, LIFETIME_PROFIT_KEY, MAX_DAYS } from "./constants";

// Import game logic
import { calculateRating, generateCustomers } from "./gameLogic";

// Import components
import {
  BasePriceScreen,
  EndDayModal,
  GameOverScreen,
  GameScreen,
  StartScreen,
} from "./components";

function LemonomicsSticker(): React.ReactElement {
  // Game state
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showEndDayModal, setShowEndDayModal] = useState<boolean>(false);

  // Game stats
  const [gameState, setGameState] = useState<GameState>({
    currentDay: 1,
    totalProfit: 0,
    averageRating: 0,
    currentCustomerIndex: 0,
    customers: [], // Will be populated with generateCustomers
    currentCustomer: null,
    dailyProfit: 0,
    dailyRatings: [],
    priceHistory: [],
    basePrice: 1.0, // Start with a default base price of $1.00
    showPriceSelection: false,
  });

  // Lifetime stats
  const [lifetimeStats, setLifetimeStats] = useState<LifetimeStats>({
    daysPlayed: 0,
    lifetimeProfit: 0,
  });

  // State for showing transaction result before moving to next customer
  const [showTransactionResult, setShowTransactionResult] =
    useState<boolean>(false);
  const [transactionResult, setTransactionResult] =
    useState<TransactionResult | null>(null);

  useEffect(() => {
    // Load lifetime stats from localStorage
    const storedDaysPlayed = localStorage.getItem(DAYS_PLAYED_KEY);
    const storedLifetimeProfit = localStorage.getItem(LIFETIME_PROFIT_KEY);

    if (storedDaysPlayed && storedLifetimeProfit) {
      setLifetimeStats({
        daysPlayed: parseInt(storedDaysPlayed, 10),
        lifetimeProfit: parseFloat(storedLifetimeProfit),
      });
    }
  }, []);

  const handleStart = (): void => {
    setGameState({
      ...gameState,
      showPriceSelection: true,
    });
    setHasStarted(true);
  };

  const handleBasePrice = (price: number): void => {
    // Generate customers with the selected base price
    const customers = generateCustomers(price);
    setGameState({
      ...gameState,
      basePrice: price,
      customers,
      currentCustomer: customers[0],
      currentCustomerIndex: 0,
      dailyProfit: 0,
      dailyRatings: [],
      priceHistory: [],
      showPriceSelection: false,
    });
  };

  const handlePriceSelection = (price: number): void => {
    const { currentCustomer, currentCustomerIndex, customers, basePrice } =
      gameState;

    if (!currentCustomer) return; // Guard clause for null check

    // Calculate rating based on price vs customer's expected price
    const rating = calculateRating(price, currentCustomer.expectedPrice);

    // Calculate profit
    const revenue = price;
    const cost = basePrice; // Cost is the base price
    const customerProfit = revenue - cost;

    // Set transaction result to display feedback to player
    setTransactionResult({
      customerName: currentCustomer.name,
      customerEmoji: currentCustomer.emoji,
      price,
      expectedPrice: currentCustomer.expectedPrice,
      profit: customerProfit,
      rating,
      buys: true,
    });

    // Show transaction result
    setShowTransactionResult(true);

    // Update customer status
    const updatedCustomers = [...customers];
    updatedCustomers[currentCustomerIndex] = {
      ...currentCustomer,
      served: true,
      actualPaid: price,
      rating,
    };

    // Update game state
    setGameState({
      ...gameState,
      customers: updatedCustomers,
      dailyProfit: gameState.dailyProfit + customerProfit,
      dailyRatings: [...gameState.dailyRatings, rating],
      priceHistory: [...gameState.priceHistory, price],
    });
  };

  const handleContinueToNextCustomer = (): void => {
    const { currentCustomerIndex, customers } = gameState;
    const nextCustomerIndex = currentCustomerIndex + 1;

    // Hide transaction result
    setShowTransactionResult(false);
    setTransactionResult(null);

    // Check if we've served all customers for the day
    if (nextCustomerIndex >= customers.length) {
      // End of day
      setShowEndDayModal(true);
    } else {
      // Move to next customer
      setGameState({
        ...gameState,
        currentCustomerIndex: nextCustomerIndex,
        currentCustomer: customers[nextCustomerIndex],
      });
    }
  };

  const handleEndDay = (): void => {
    const { dailyProfit, dailyRatings, totalProfit, currentDay } = gameState;

    // Calculate average rating
    const averageRating =
      dailyRatings.length > 0
        ? dailyRatings.reduce(
            (sum: number, rating: number) => sum + rating,
            0
          ) / dailyRatings.length
        : 0;

    // Update game state for next day
    setGameState({
      ...gameState,
      currentDay: currentDay + 1,
      totalProfit: totalProfit + dailyProfit,
      averageRating,
      showPriceSelection: true, // Show price selection for next day
    });

    // Hide end day modal
    setShowEndDayModal(false);

    // Check if game is over (max days reached)
    if (currentDay >= MAX_DAYS) {
      setGameOver(true);

      // Update lifetime stats
      const newLifetimeProfit =
        lifetimeStats.lifetimeProfit + totalProfit + dailyProfit;
      const newDaysPlayed = lifetimeStats.daysPlayed + MAX_DAYS;

      setLifetimeStats({
        daysPlayed: newDaysPlayed,
        lifetimeProfit: newLifetimeProfit,
      });

      // Save to localStorage
      localStorage.setItem(DAYS_PLAYED_KEY, newDaysPlayed.toString());
      localStorage.setItem(LIFETIME_PROFIT_KEY, newLifetimeProfit.toString());
    }
  };

  const restartGame = (): void => {
    // Reset game state
    setGameState({
      currentDay: 1,
      totalProfit: 0,
      averageRating: 0,
      currentCustomerIndex: 0,
      customers: [],
      currentCustomer: null,
      dailyProfit: 0,
      dailyRatings: [],
      priceHistory: [],
      basePrice: 1.0,
      showPriceSelection: true,
    });

    // Reset game flags
    setGameOver(false);
    setShowEndDayModal(false);
    setShowTransactionResult(false);
    setTransactionResult(null);
  };

  // Main render function
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-yellow-50 rounded-xl overflow-hidden relative">
      {!hasStarted ? (
        <StartScreen lifetimeStats={lifetimeStats} onStart={handleStart} />
      ) : gameState.showPriceSelection ? (
        <BasePriceScreen onBasePriceSelect={handleBasePrice} />
      ) : gameOver ? (
        <GameOverScreen
          gameState={gameState}
          lifetimeStats={lifetimeStats}
          onRestart={restartGame}
        />
      ) : (
        <GameScreen
          currentDay={gameState.currentDay}
          dailyProfit={gameState.dailyProfit}
          basePrice={gameState.basePrice}
          currentCustomer={gameState.currentCustomer}
          showTransactionResult={showTransactionResult}
          transactionResult={transactionResult}
          onPriceSelect={handlePriceSelection}
          onContinueToNextCustomer={handleContinueToNextCustomer}
        />
      )}

      {/* End Day Modal */}
      {showEndDayModal && (
        <EndDayModal gameState={gameState} onEndDay={handleEndDay} />
      )}
    </div>
  );
}

export default LemonomicsSticker;
