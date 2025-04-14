"use client";

import { useCrypto } from "@/hooks/useCrypto";
import { CryptoData } from "@/types/cryptoTypes";
import { useState } from "react";
import { BuyModal } from "../BuyModal/BuyModal";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useUser } from "@/providers/UserProvider/UserProvider";
import { SearchBar } from "./partials/SearchBar";
import { CryptoListError } from "./partials/CryptoListError";
import { CryptoTable } from "./partials/CryptoTable";

export const CryptoList = () => {
  const { user, buyCrypto } = useUser();
  const { cryptos, loading, error } = useCrypto();
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);

  const handleCryptoClick = (crypto: CryptoData) => {
    setSelectedCrypto(crypto);
    onOpen();
  };

  const filteredCryptos = [...cryptos]
    .filter((crypto) =>
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse h-20 w-full bg-gray-200 rounded-md mx-auto mb-4"></div>
            <div className="animate-pulse h-200  w-full bg-gray-200 rounded-md mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      {isOpen && selectedCrypto && (
        <BuyModal
          onClose={onClose}
          availableFunds={user?.balance || 0}
          onBuy={buyCrypto}
          crypto={
            cryptos.find((crypto) => crypto.symbol === selectedCrypto.symbol) ||
            ({} as CryptoData)
          }
        />
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">
        Cryptocurrency Price Tracker
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
      />

      {loading && !cryptos.length && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">
            Loading cryptocurrency data...
          </p>
        </div>
      )}

      {error && <CryptoListError error={error} />}

      {!error && cryptos.length > 0 && (
        <div
          className={`overflow-hidden rounded-lg shadow-lg transition-all duration-300 bg-white`}
        >
          <CryptoTable
            filteredCryptos={filteredCryptos}
            handleCryptoClick={handleCryptoClick}
          />

          {filteredCryptos.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No cryptocurrencies found matching &quot;{searchTerm}&quot;
              </p>
              <button
                className="mt-2 text-blue-500 hover:text-blue-700"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {cryptos.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredCryptos.length} of {cryptos.length} cryptocurrencies
          • Data updates in real-time
        </div>
      )}
    </div>
  );
};
