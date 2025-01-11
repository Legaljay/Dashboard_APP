import { memo } from "react";
import CreditBalanceCard from "./CreditBalanceCard";
import CurrentPlanCard from "./CurrentPlanCard";
import { Table } from "@/components/ui/table";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import { motion } from "framer-motion";
import useTransaction from "../hooks/useTransaction";
import { Transaction } from "@/redux-slice/transactions/transactions.slice";
import { createTypedColumns } from "@/components/ui/table/CustomRenderers";
import useProFeatures from "@/components/ui/modals/pro-service-modals/hook/useProFeatures";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

const Overview: React.FC = () => {
  const {
    currentPage,
    totalPages,
    pageSize,
    loading,
    error,
    transactions,
    fetchTransaction,
  } = useTransaction();

  const { createStatusColumn, createDateTimeColumn, createTextTruncateColumn, createCustomColumn } =
    createTypedColumns<Transaction>();

  const { giftBalance, walletBalanceValue, buttonRef, isLoading } = useProFeatures();

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="px-20 space-y-36 mb-40"
    >
      <section>
        {isLoading && loading ? (
          <div className="flex gap-6 mt-6">
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                className="w-[33.3%] h-[159px] rounded-xl bg-gray-100/80"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 mt-6">
            <CreditBalanceCard
              walletBalance={walletBalanceValue}
              giftBalance={giftBalance}
            />
            <CurrentPlanCard />
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-[#121212] text-2xl font-medium">Funding</h2>
        <Table<Transaction>
          columns={[
            createDateTimeColumn("created_at", "Date", 400, {
              dateStyle: 'long',
              timeStyle: 'short',
            }),
            createTextTruncateColumn("reference", "Funding ID"),
            {
              header: "Amount",
              accessorKey: "amount",
            },
            // {
            //   header: "Value",
            //   accessorKey: "amount",
            // },
            createCustomColumn("currency_symbol", "amount", "Value"),
            {
              header: "Type",
              accessorKey: "tx_type",
            },
            createStatusColumn("status", "Status", {
              success: "success",
              inactive: "error",
              pending: "warning",
            }),
          ]}
          pollingInterval={30000}
          onRefresh={fetchTransaction}
          data={transactions}
          isLoading={loading && isLoading}
          onRowClick={() => {}}
          loadingMessage="Loading..."
          border
          enableSorting
          enableFiltering
          enableSelection
          enableColumnVisibility
          enablePagination
          emptyStateMessage="No Funding History"
        />
      </section>
    </motion.main>
  );
};

export default memo(Overview);
