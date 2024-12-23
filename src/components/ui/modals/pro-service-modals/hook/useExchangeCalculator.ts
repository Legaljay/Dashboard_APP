import {
  convertCurrency,
  fetchCurrencyRates,
  selectExchangeCurrencyData,
  selectExchangeRate,
} from "@/redux-slice/currency/currency.slice";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { useCallback, useEffect } from "react";

const conversions = [
  {
    from: "NGN",
    to: "USD",
  },
  {
    from: "NGN",
    to: "GBP",
  },
  {
    from: "NGN",
    to: "EUR",
  },
  {
    from: "USD",
    to: "NGN",
  },
  {
    from: "USD",
    to: "GBP",
  },
  {
    from: "USD",
    to: "EUR",
  },
  {
    from: "EUR",
    to: "USD",
  },
  {
    from: "EUR",
    to: "NGN",
  },
  {
    from: "EUR",
    to: "GBP",
  },
  {
    from: "NGN",
    to: "EUR",
  },
  {
    from: "USD",
    to: "NGN",
  },
  {
    from: "NGN",
    to: "GBP",
  },
  {
    from: "NGN",
    to: "USD",
  },
  {
    from: "EUR",
    to: "NGN",
  },
  {
    from: "USD",
    to: "GBP",
  },
  {
    from: "EUR",
    to: "USD",
  },
  {
    from: "USD",
    to: "EUR",
  },
  {
    from: "EUR",
    to: "GBP",
  },
];

const useExchangeCalculator = ({ from, to }: { from: string; to: string }) => {
  const dispatch = useAppDispatch();
  const { loading, error, lastUpdated, rates, conversions } = useAppSelector(selectExchangeCurrencyData);
  const fromToRate = useAppSelector(selectExchangeRate(from, to));

  useEffect(() => {
    dispatch(fetchCurrencyRates());
  }, []);

  const handleConvert = useCallback((amount: number) => {
    dispatch(convertCurrency({ amount, from, to }));
  }, [dispatch, from, to]);


  const calculateExchange = useCallback((amount: number) => {
    return fromToRate
      ? parseFloat((amount * parseFloat(fromToRate) * 100).toFixed(2))
      : 0.00;
  }, [fromToRate]);

  return { calculateExchange, handleConvert, loading, error, lastUpdated, rates, conversions };
};

export default useExchangeCalculator;
