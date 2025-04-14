import { User } from "@/types/userTypes";

interface BalanceMetricsProps {
  user: User;
  totalCostOfAllHoldings: number;
}

const BalanceMetrics = ({
  user,
  totalCostOfAllHoldings,
}: BalanceMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium mb-1">
          Available Balance
        </div>
        <div className="text-2xl font-bold text-gray-900">
          $
          {user.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-sm font-medium mb-1">
          Total Investment
        </div>
        <div className="text-2xl font-bold text-gray-900">
          $
          {totalCostOfAllHoldings.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
};

export default BalanceMetrics;
