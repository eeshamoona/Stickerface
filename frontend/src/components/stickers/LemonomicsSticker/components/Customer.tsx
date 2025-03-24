import React from 'react';
import { Customer as CustomerType } from '../types';

interface CustomerProps {
  customer: CustomerType;
}

const Customer: React.FC<CustomerProps> = ({ customer }) => {
  const { emoji, thought, expectedPrice, name, type } = customer;

  // We'll now show price hints rather than exact expectations
  const getPriceHint = () => {
    // This is a placeholder - in the actual implementation, we'd need the basePrice
    // from the game state, but for component separation we're using a prop-based approach
    const ratio = expectedPrice / 1.0; // Using 1.0 as a default basePrice

    if (ratio < 0.85) {
      return (
        <p className="text-xs mt-1 text-red-600 font-medium">
          Seems price-sensitive
        </p>
      );
    } else if (ratio > 1.15) {
      return (
        <p className="text-xs mt-1 text-green-600 font-medium">
          Might pay premium prices
        </p>
      );
    }
    return (
      <p className="text-xs mt-1 text-blue-600 font-medium">
        Expects fair pricing
      </p>
    );
  };

  // Add a type-specific hint based on customer type
  const getCustomerTypeHint = () => {
    switch (type) {
      case "thrifty":
        return (
          <p className="text-xs italic text-gray-500">Looks for bargains</p>
        );
      case "kid":
        return (
          <p className="text-xs italic text-gray-500">
            Has limited allowance
          </p>
        );
      case "enthusiast":
        return (
          <p className="text-xs italic text-gray-500">Appreciates quality</p>
        );
      case "connoisseur":
        return (
          <p className="text-xs italic text-gray-500">
            Very discerning taste
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Thought bubble */}
      <div className="bg-white rounded-2xl p-3 mb-2 shadow-md relative">
        <p className="text-sm text-black font-medium">
          {name} the {emoji}
        </p>
        <p className="text-sm text-black mt-1">{thought}</p>
        {getPriceHint()}
        {getCustomerTypeHint()}
        {/* Bubble tail */}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 
                    rotate-45 bg-white"
        ></div>
      </div>

      {/* Customer emoji */}
      <div className="text-4xl">{emoji}</div>
    </div>
  );
};

export default Customer;
