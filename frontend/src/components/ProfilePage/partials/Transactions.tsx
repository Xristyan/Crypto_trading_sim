import { transactionHeaders } from "@/constants/tableHeaders";
import {
  formatPrice,
  formatQuantity,
  timeStampToDate,
} from "@/helpers/cryptoHelpers";
import { TransactionType, User } from "@/types/userTypes";

const CELL_STYLES = {
  base: "px-6 py-4 whitespace-nowrap",
  text: {
    right: "text-right text-sm text-gray-900 font-medium",
    center: "text-center text-sm text-gray-900",
    left: "text-left text-sm text-gray-900",
  },
  header:
    "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider",
};

const Transactions = ({ user }: { user: User }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Transactions
        </h2>
      </div>
      {user.transactions && user.transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {transactionHeaders.map((header) => (
                  <th
                    key={header.key}
                    scope="col"
                    className={CELL_STYLES.header}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {user.transactions.map((tx) => {
                const { dateFormatted, timeFormatted } = timeStampToDate(
                  tx.timestamp
                );
                const isBuy = tx.transactionType === TransactionType.BUY;
                const typeBadgeStyle = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isBuy
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`;
                const profitLossStyle =
                  Number(tx.profitLoss) >= 0
                    ? "text-green-600"
                    : "text-red-600";

                return (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className={CELL_STYLES.base}>
                      <span className={typeBadgeStyle}>
                        {tx.transactionType}
                      </span>
                    </td>

                    <td className={CELL_STYLES.base}>
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tx.cryptoSymbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td
                      className={`${CELL_STYLES.base} ${CELL_STYLES.text.right}`}
                    >
                      {formatQuantity(tx.quantity)}
                    </td>

                    <td
                      className={`${CELL_STYLES.base} ${CELL_STYLES.text.right}`}
                    >
                      ${formatPrice(tx.pricePerUnit)}
                    </td>

                    <td
                      className={`${CELL_STYLES.base} ${CELL_STYLES.text.right}`}
                    >
                      ${formatPrice(tx.totalPrice)}
                    </td>

                    <td
                      className={`${CELL_STYLES.base} ${CELL_STYLES.text.right}`}
                    >
                      {isBuy ? (
                        "-"
                      ) : (
                        <span className={profitLossStyle}>
                          ${formatPrice(Math.abs(Number(tx.profitLoss)))}
                          {Number(tx.profitLoss) >= 0 ? " +" : " -"}
                        </span>
                      )}
                    </td>

                    <td
                      className={`${CELL_STYLES.base} text-right text-sm text-gray-500`}
                    >
                      <div>{dateFormatted}</div>
                      <div className="text-xs">{timeFormatted}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <p>No transaction history available.</p>
        </div>
      )}
    </div>
  );
};

export default Transactions;
