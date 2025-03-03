export type ExchangeRateDataType = {
  name: string;
  firstCurrency: string;
  secondCurrency: string;
  tickSizes: string[];
};

export const BTCUSDT: ExchangeRateDataType = {
  name: "BTCUSDT",
  firstCurrency: "BTC",
  secondCurrency: "USDT",
  tickSizes: ["0.1", "1", "10", "50", "100"],
};

export const BCHUSDT: ExchangeRateDataType = {
  name: "BCHUSDT",
  firstCurrency: "BCH",
  secondCurrency: "USDT",
  tickSizes: ["0.01", "0.1", "1", "10"],
};

export const ETHUSDT: ExchangeRateDataType = {
  name: "ETHUSDT",
  firstCurrency: "ETH",
  secondCurrency: "USDT",
  tickSizes: ["0.01", "0.1", "1", "10", "50", "100"],
};

export const LTCUSDT: ExchangeRateDataType = {
  name: "LTCUSDT",
  firstCurrency: "LTC",
  secondCurrency: "USDT",
  tickSizes: ["0.1", "1", "10"],
};

export const XRPUSDT: ExchangeRateDataType = {
  name: "XRPUSDT",
  firstCurrency: "XRP", // poprawiony błąd literówki
  secondCurrency: "USDT",
  tickSizes: ["0.0001", "0.001", "0.01", "0.1"],
};

export const EOSUSDT: ExchangeRateDataType = {
  name: "EOSUSDT",
  firstCurrency: "EOS",
  secondCurrency: "USDT",
  tickSizes: ["0.001", "0.01"],
};


export const EXCHANGE_RATES = [
  BTCUSDT,
  BCHUSDT,
  ETHUSDT,
  LTCUSDT,
  XRPUSDT,
  EOSUSDT,
];
