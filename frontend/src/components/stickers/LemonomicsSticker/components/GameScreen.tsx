import React from 'react';
import { Customer as CustomerType, TransactionResult } from '../types';
import Customer from './Customer';
import PriceSelector from './PriceSelector';
import GameStats from './GameStats';
import TransactionResultModal from './TransactionResult';

interface GameScreenProps {
  currentDay: number;
  dailyProfit: number;
  basePrice: number;
  currentCustomer: CustomerType | null;
  showTransactionResult: boolean;
  transactionResult: TransactionResult | null;
  onPriceSelect: (price: number) => void;
  onContinueToNextCustomer: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
  currentDay,
  dailyProfit,
  basePrice,
  currentCustomer,
  showTransactionResult,
  transactionResult,
  onPriceSelect,
  onContinueToNextCustomer,
}) => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-4">
      {/* Top stats area */}
      <GameStats currentDay={currentDay} dailyProfit={dailyProfit} />

      {/* Middle - customer area */}
      <div className="flex-grow flex items-center justify-center my-4">
        {currentCustomer && <Customer customer={currentCustomer} />}
      </div>

      {/* Bottom - price controls */}
      <div className="mb-2">
        {currentCustomer && (
          <PriceSelector basePrice={basePrice} onPriceSelect={onPriceSelect} />
        )}
      </div>

      {/* Transaction Result Modal */}
      {showTransactionResult && transactionResult && (
        <TransactionResultModal
          result={transactionResult}
          onContinue={onContinueToNextCustomer}
        />
      )}
    </div>
  );
};

export default GameScreen;
