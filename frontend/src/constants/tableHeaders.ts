export const transactionHeaders = [
  {
    label: "Type",
    key: "transactionType",
  },
  {
    label: "Crypto",
    key: "cryptoSymbol",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Price",
    key: "pricePerUnit",
  },
  {
    label: "Total",
    key: "totalPrice",
  },
  {
    label: "P/L",
    key: "profitLoss",
  },
  {
    label: "Date",
    key: "timestamp",
  },
];

export const holdingsTableHeaders = [
  {
    label: "Asset",
    key: "cryptoSymbol",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Avg. Price Per Unit",
    key: "pricePerUnit",
  },
  {
    label: "Total Cost",
    key: "totalCost",
  },
];

export const cryptoTableHeaders = [
  {
    label: "Symbol",
    key: "symbol",
  },
  {
    label: "Last Price",
    key: "last",
  },
  {
    label: "Bid",
    key: "bid",
    hidden: true,
  },
  {
    label: "24h Volume",
    key: "volume",
    hidden: true,
  },
  {
    label: "24h Change",
    key: "change_pct",
  },
];
