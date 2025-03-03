export type CurrencyDataType = {
  id: string;
  sign: string;
};

export const USD: CurrencyDataType = {
  id: "USD",
  sign: "$",
};

export const CURRENCIES: CurrencyDataType[] = [USD];
