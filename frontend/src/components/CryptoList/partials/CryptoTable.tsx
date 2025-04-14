import { cryptoTableHeaders } from "@/constants/tableHeaders";
import { formatPrice } from "@/helpers/cryptoHelpers";
import { CryptoData } from "@/types/cryptoTypes";
import { FC } from "react";

interface CryptoTableProps {
  filteredCryptos: CryptoData[];
  handleCryptoClick: (crypto: CryptoData) => void;
}

export const CryptoTable: FC<CryptoTableProps> = ({
  filteredCryptos,
  handleCryptoClick,
}) => {
  const formatChange = (changePct?: number) => {
    const formattedChange = formatPrice(changePct);
    const isPositive = parseFloat(formattedChange) >= 0;

    return (
      <span
        className={`inline-flex items-center font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className={`mr-1 ${isPositive ? "rotate-0" : "rotate-180"}`}>
          {isPositive ? "▲" : "▼"}
        </span>
        {isPositive ? "+" : ""}
        {formattedChange}%
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700">
            {cryptoTableHeaders.map((header) => (
              <th
                key={header.key}
                className={`p-3 md:p-4 text-left font-medium ${
                  header.hidden ? "hidden md:table-cell" : ""
                }`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto, index) => (
            <tr
              key={index}
              onClick={() => handleCryptoClick(crypto)}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
            >
              <td className="p-3 md:p-4 text-left font-medium">
                {crypto.symbol}
              </td>
              <td className="p-3 md:p-4 text-right font-mono">
                ${formatPrice(crypto.last)}
              </td>
              <td className="p-3 md:p-4 text-right font-mono hidden md:table-cell">
                ${formatPrice(crypto.bid)}
              </td>
              <td className="p-3 md:p-4 text-right font-mono hidden lg:table-cell">
                ${formatPrice(crypto.volume)}
              </td>
              <td className="p-3 md:p-4 text-right">
                {formatChange(crypto.change_pct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
