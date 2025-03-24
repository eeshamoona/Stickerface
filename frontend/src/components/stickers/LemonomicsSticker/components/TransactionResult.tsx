import React from 'react';
import { TransactionResult as TransactionResultType } from '../types';

interface TransactionResultProps {
  result: TransactionResultType;
  onContinue: () => void;
}

const TransactionResult: React.FC<TransactionResultProps> = ({ result, onContinue }) => {
  const {
    customerName,
    customerEmoji,
    price,
    expectedPrice,
    profit,
    rating,
    buys,
  } = result;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-10">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold text-center mb-3 text-black">
          {buys ? "Sale Complete!" : "Customer Left"}
        </h2>

        <div className="flex items-center justify-center mb-4">
          <span className="text-4xl">{customerEmoji}</span>
          <div className="ml-3">
            <p className="font-medium text-black">{customerName}</p>
            {buys ? (
              <p className="text-sm text-green-600">Bought your lemonade</p>
            ) : (
              <p className="text-sm text-red-600">
                Thought it was too expensive
              </p>
            )}
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-black">Your price:</span>
            <span className="text-sm font-medium text-black">
              ${price.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between mb-1">
            <span className="text-sm text-black">Expected price:</span>
            <span className="text-sm font-medium text-black">
              ${expectedPrice.toFixed(2)}
            </span>
          </div>

          <div className="h-px bg-yellow-200 my-2"></div>

          <div className="flex justify-between">
            <span className="text-black">Profit:</span>
            <span
              className={`font-medium ${
                profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${profit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <span className="text-black">Rating:</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg
                    shadow transition hover:shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TransactionResult;
