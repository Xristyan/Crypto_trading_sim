export const validateCallback = (value: number, availableFunds: number) => {
  if (isNaN(value)) {
    return "Please enter a valid number";
  } else if (value <= 0) {
    return "Price must be greater than 0";
  } else if (value > availableFunds) {
    return "Price exceeds available funds";
  } else {
    return "";
  }
};
