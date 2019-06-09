export const formatCurrency = number => {
  return new Intl.NumberFormat("pt-BR", { maximumSignificantDigits: 6 }).format(
    number / 1000000
  );
};

export const formatPercent = number => {
  const with2Decimals = number.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  return with2Decimals;
};
