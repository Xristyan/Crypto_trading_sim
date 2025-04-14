"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../Modal/Modal";
import { CryptoData } from "@/types/cryptoTypes";
import { useCryptoInput } from "@/hooks/useCryptoInput";
import { validateCallback } from "@/helpers/validateHelpers";

interface BuyModalProps {
  onClose: () => void;
  onBuy: (
    cryptoSymbol: string,
    amount: string,
    pricePerUnit: number
  ) => Promise<{ error: string | null }>;
  availableFunds: number;
  crypto: CryptoData;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  onClose,
  onBuy,
  availableFunds,
  crypto,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [buyError, setBuyError] = useState<string | null>(null);

  const {
    value: amount,
    onChange: handleAmountChange,
    error,
    setInputValue: setAmount,
    onBlur: handleAmountBlur,
  } = useCryptoInput({
    initialValue: "0",
    validateCallback: (value: number) =>
      validateCallback(value, availableFunds),
    maxDecimalPlaces: 2,
  });

  useEffect(() => {
    if (parseFloat(amount) > 0 && crypto && crypto.bid) {
      const calculatedQty = parseFloat(amount) / crypto.bid;
      setQuantity(calculatedQty);
    } else {
      setQuantity(0);
    }
  }, [amount, crypto]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setQuantity(value);
    const calculatedAmount = value * (crypto.bid || 0);
    setAmount(calculatedAmount);
  };

  const handleMaxClick = () => {
    setAmount(availableFunds);
    const calculatedQty = parseFloat(amount) / crypto.bid;
    setQuantity(calculatedQty);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!error && parseFloat(amount) > 0 && crypto.bid && quantity > 0) {
      setIsLoading(true);
      const { error } = await onBuy(crypto.symbol, amount, crypto.bid);
      if (error) {
        setBuyError(error);
      } else {
        onClose();
      }
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} className="max-w-md">
      {buyError && <p className="text-sm text-red-500 mt-1">{buyError}</p>}
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-4">Buy {crypto.symbol}</h2>
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            Current price per {crypto.symbol.split("/")[0]}: $
            {crypto.bid?.toFixed(2)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount to spend ($)
            </label>
            <div className="relative">
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 cursor-pointer top-1/2 transform -translate-y-1/2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                MAX
              </button>
            </div>

            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1"
            >
              Quantity
            </label>
            <input
              id="quantity"
              className="w-full"
              type="range"
              min="0"
              max={crypto.bid ? availableFunds / crypto.bid : 0}
              step="0.00000001"
              value={quantity}
              onChange={handleQuantityChange}
            />

            <p className="text-sm text-gray-500 mt-1">
              Available funds: ${availableFunds.toFixed(2)}
            </p>

            {parseFloat(amount) > 0 && !error && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium">You will receive:</p>
                <p className="text-lg font-bold">
                  {quantity.toFixed(8)} {crypto.symbol.split("/")[0]}
                </p>
                <p className="text-xs text-gray-500">
                  at ${crypto.bid?.toFixed(4)} per {crypto.symbol.split("/")[0]}
                </p>
              </div>
            )}

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!error || parseFloat(amount) <= 0}
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              {isLoading ? "Buying..." : "Buy " + crypto.symbol.split("/")[0]}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
