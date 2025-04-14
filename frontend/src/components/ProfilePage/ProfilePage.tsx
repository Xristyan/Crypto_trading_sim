"use client";
import { useCrypto } from "@/hooks/useCrypto";
import { useDisclosure } from "@/hooks/useDisclosure";

import { useUser } from "@/providers/UserProvider/UserProvider";
import { Holding } from "@/types/userTypes";
import { useState } from "react";
import { SellModal } from "../SellModal";
import BalanceMetrics from "./partials/BalanceMetrics";
import Holdings from "./partials/Holdings";
import Transactions from "./partials/Transactions";
export const ProfilePage = () => {
  const { user, sellCrypto } = useUser();
  const { cryptos, loading, error } = useCrypto();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCrypto, setSelectedCrypto] = useState<Holding | null>(null);

  if (!user || loading || error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse h-20 w-full bg-gray-200 rounded-md mx-auto mb-4"></div>
            <div className="animate-pulse h-100  w-full bg-gray-200 rounded-md mx-auto mb-4"></div>
            <div className="animate-pulse h-20 w-full bg-gray-200 rounded-md mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalCostOfAllHoldings =
    user.holdings?.reduce((sum, holding) => {
      return sum + holding.totalCost;
    }, 0) || 0;

  const getTotalCost = (holding: Holding) => {
    const crypto = cryptos?.find(
      (crypto) => crypto.symbol === holding.cryptoSymbol
    );
    return holding.quantity * (crypto?.bid ?? 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      {isOpen && (
        <SellModal
          onClose={onClose}
          onSell={sellCrypto}
          crypto={
            cryptos?.filter(
              (crypto) => crypto.symbol === selectedCrypto?.cryptoSymbol
            )[0]
          }
          holding={selectedCrypto!}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user.username}&apos;s Portfolio
          </h1>
        </div>

        <BalanceMetrics
          user={user}
          totalCostOfAllHoldings={totalCostOfAllHoldings}
        />

        <Holdings
          user={user}
          getTotalCost={getTotalCost}
          setSelectedCrypto={setSelectedCrypto}
          onOpen={onOpen}
        />

        <Transactions user={user} />
      </div>
    </div>
  );
};
