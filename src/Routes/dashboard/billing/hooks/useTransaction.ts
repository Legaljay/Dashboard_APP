import { useApiWithCache } from "@/hooks/useApiWithCache";
import useDataFetching from "@/hooks/useDataFetching";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import {
  fetchTransactions,
  Transaction,
} from "@/redux-slice/transactions/transactions.slice";
import React, { useEffect } from "react";

const useTransaction = () => {
  const dispatch = useAppDispatch();
  const { currentPage, totalPages, pageSize, loading, error, transactions } =
    useAppSelector((state) => state.transactions);

  const {
    // data: transactions,
    // loading,
    refetch: fetchTransaction,
  } = useDataFetching<Transaction>(() => dispatch(fetchTransactions({ page: 1, pageSize: 10 })).unwrap(), ["transaction"], {
    showToasts: { error: false, success: false },
    toastMessages: {
      error: (err) => `Failed to load user: ${err.message}`,
    },
    pollingInterval: 30000,
    revalidateOnFocus: true,
    retryCount: 3,
    // transform: (user) => ({
    //   ...user,
    //   name: user.name.toUpperCase(),
    // }),
    // onSuccess: (user, dispatch) => {
    //   dispatch(userActions.setUser(user));
    // },
  });


  return {
    currentPage,
    totalPages,
    pageSize,
    loading,
    error,
    transactions,
    // invalidateCache,
    fetchTransaction,
  };
};

export default useTransaction;
