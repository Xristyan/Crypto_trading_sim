"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "../Modal/Modal";
import { CryptoData } from "@/types/cryptoTypes";
import { Holding } from "@/types/userTypes";

interface SellModalProps {
  onClose: () => void;
  onSell: (
    cryptoSymbol: string,
    quantity: number,
    pricePerUnit: number
  ) => Promise<{ error: string | null }>;
  crypto: CryptoData;
  holding: Holding;
}

export const SellModal: React.FC<SellModalProps> = ({
  onClose,
  onSell,
  crypto,
  holding,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [sellError, setSellError] = useState<string | null>(null);
  useEffect(() => {
    const calculatedAmount = Number(quantity) * (crypto.bid || 0);
    setAmount(calculatedAmount.toFixed(2));
  }, [quantity, crypto.bid]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && crypto.bid) {
      setIsLoading(true);
      const { error } = await onSell(crypto.symbol, quantity, crypto.bid);
      if (error) {
        setSellError(error);
      } else {
        onClose();
      }
      setIsLoading(false);
    }
  };

  console.log(holding.quantity);
  return (
    <Modal onClose={onClose} className="max-w-md">
      {sellError && <p className="text-sm text-red-500 mt-1">{sellError}</p>}

      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-4">Sell {crypto.symbol}</h2>
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-600">
            Current price: ${crypto.bid?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Available: {holding?.quantity?.toFixed(8)}{" "}
            {crypto.symbol.split("/")[0]}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-1"
            >
              Quantity
            </label>
            {quantity}
            <input
              id="quantity"
              className="w-full"
              type="range"
              min="0"
              max={holding.quantity}
              step="0.00000001"
              value={quantity}
              onChange={handleQuantityChange}
            />

            {quantity > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-md">
                <p className="text-sm font-medium">You will receive:</p>
                <p className="text-lg font-bold">
                  ${Number(amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  at ${crypto.bid?.toFixed(2)} per {crypto.symbol.split("/")[0]}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={quantity <= 0}
              className="px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "Selling..." : "Sell"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
