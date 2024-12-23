import { memo } from "react";
import CreditBalanceCard from "./CreditBalanceCard";
import CurrentPlanCard from "./CurrentPlanCard";
import { Table } from "@/components/ui/table";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
};

const Overview: React.FC = () => {
  const firstRender = true;
  const loading = false;
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="px-20 space-y-40"
    >
      <section>
        {firstRender && loading ? (
          <div className="flex gap-6 mt-6">
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                className="w-[33.3%] h-[159px] rounded-xl bg-gray-100/80"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-6 mt-6">
            <CreditBalanceCard walletBalance={null} giftBalance={null} />
            <CurrentPlanCard />
          </div>
        )}
      </section>
      <section className="space-y-3">
        <h2 className="text-[#121212] text-2xl font-medium">Funding</h2>
        <Table
          columns={[
            {
              header: "Date",
              accessorKey: "name",
            },
            {
              header: "Funding ID",
              accessorKey: "funding_id",
            },
            {
              header: "Amount",
              accessorKey: "amount",
            },
            {
              header: "Value",
              accessorKey: "amount",
            },
            {
              header: "Type",
              accessorKey: "type",
            },
            {
              header: "Status",
              accessorKey: "status",
            },
          ]}
          pollingInterval={30000}
          data={[]}
          isLoading={true}
          onRowClick={() => {}}
          loadingMessage="Loading..."
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
