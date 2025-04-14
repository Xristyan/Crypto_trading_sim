import { holdingsTableHeaders } from "@/constants/tableHeaders";
import { Holding, User } from "@/types/userTypes";
import { useRouter } from "next/navigation";

interface HoldingsProps {
  user: User;
  getTotalCost: (holding: Holding) => number;
  setSelectedCrypto: (crypto: Holding) => void;
  onOpen: () => void;
}
const Holdings = ({
  user,
  getTotalCost,
  setSelectedCrypto,
  onOpen,
}: HoldingsProps) => {
  const router = useRouter();

  const displayCostDifference = (holding: Holding) => {
    const EPSILON = 1e-6;

    const costDifference = getTotalCost(holding) - holding.totalCost;
    const isZero = Math.abs(costDifference) < EPSILON;

    return (
      <div>
        {isZero ? null : costDifference > 0 ? (
          <span className="text-green-600">+ ${costDifference.toFixed(2)}</span>
        ) : (
          <span className="text-red-600">
            - ${Math.abs(costDifference).toFixed(2)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Your Holdings</h2>
      </div>

      {user.holdings && user.holdings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {holdingsTableHeaders.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {user.holdings.map((holding, index) => {
                const quantity = holding.quantity;
                const avaragePrice = holding.pricePerUnit;

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedCrypto(holding);
                      onOpen();
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-500">
                          {holding.cryptoSymbol.substring(0, 1)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {holding.cryptoSymbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                      {quantity.toLocaleString("en-US", {
                        maximumFractionDigits: 8,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                      $
                      {avaragePrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                      <div>${getTotalCost(holding).toFixed(2)}</div>
                      {displayCostDifference(holding)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <p>You don&apos;t have any crypto holdings yet.</p>
          <button
            className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => router.push("/")}
          >
            Start Trading
          </button>
        </div>
      )}
    </div>
  );
};

export default Holdings;
