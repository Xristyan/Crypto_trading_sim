const formatPrice = (price?: number): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0.00";
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const timeStampToDate = (
  timeStamp: number[]
): { dateFormatted: string; timeFormatted: string } => {
  const timestamp = Array.isArray(timeStamp)
    ? new Date(
        timeStamp[0],
        timeStamp[1] - 1,
        timeStamp[2],
        timeStamp[3],
        timeStamp[4],
        timeStamp[5]
      )
    : new Date();

  const dateFormatted = timestamp.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeFormatted = timestamp.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { dateFormatted, timeFormatted };
};

const formatQuantity = (value: number) =>
  Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });

export { formatPrice, timeStampToDate, formatQuantity };
