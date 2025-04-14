import { useCallback, useState } from "react";

type CryptoInputProps = {
  initialValue: string;
  validateCallback: (value: number) => string;
  maxDecimalPlaces?: number;
};

export const useCryptoInput = ({
  initialValue,
  validateCallback,
  maxDecimalPlaces = 2,
}: CryptoInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const setInputValue = useCallback(
    (newValue: number) => {
      const formattedValue = newValue.toFixed(maxDecimalPlaces);
      setValue(formattedValue);

      const error = validateCallback(newValue);
      setError(error);
    },
    [maxDecimalPlaces, validateCallback]
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
        if (
          inputValue.includes(".") &&
          inputValue.split(".")[1]?.length > maxDecimalPlaces
        ) {
          return;
        }

        if (inputValue === "") {
          setValue("0");
          setError(validateCallback(0));
          return;
        }

        if (
          inputValue !== "0" &&
          inputValue !== "0." &&
          inputValue.startsWith("0") &&
          !inputValue.startsWith("0.")
        ) {
          const withoutLeadingZeros = inputValue.replace(/^0+/, "");
          setValue(withoutLeadingZeros || "0");

          const parsedValue = parseFloat(withoutLeadingZeros || "0");
          setError(validateCallback(parsedValue));
          return;
        }

        setValue(inputValue);

        const parsedValue = parseFloat(inputValue);
        if (isNaN(parsedValue)) {
          setError(validateCallback(0));
        } else {
          setError(validateCallback(parsedValue));
        }
      }
    },
    [maxDecimalPlaces, validateCallback]
  );

  const onBlur = useCallback(() => {
    if (value === ".") {
      setValue("0");
    } else if (value === "0.") {
      setValue("0");
    } else if (value !== "0" && value !== "") {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        setValue(parsedValue.toFixed(maxDecimalPlaces));
      }
    }

    const error = validateCallback(parseFloat(value) || 0);
    setError(error);
  }, [maxDecimalPlaces, validateCallback, value]);

  return {
    value,
    error,
    onChange,
    onBlur,
    setInputValue,
  };
};
