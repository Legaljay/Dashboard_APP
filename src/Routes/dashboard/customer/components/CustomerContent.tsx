import { memo } from "react";
import CustomerTable from "./CustomerTable";


interface CustomerContentProps {
  data: any;
  page: number;
  loading: boolean;
}

export default memo(function CustomerContent({ data, page, loading }: CustomerContentProps) {

  return (
    <main className="relative space-y-20 font-figtree">
      <header
        className="pl-[24px] shadow-box  dark:shadow-black dark:shadow-md pr-[51px] w-full py-[47px] rounded-xl mb-8 flex justify-between items-center dark:bg-[#FCFc] bg-instructions-header dark:bg-customers-header-dark"
      >
        <div className="flex flex-col">
          <p className=" font-bold text-[32px] text-bamboo ">Customers</p>
          <p className="text-sm font-normal leading-6 text-BLACK-_300 dark:text-WHITE-_400 dark:font-semibold">
            Track, manage and Engage your customers
          </p>
        </div>
      </header>
      <CustomerTable customers={data} loading={loading} page={page} />
    </main>
  );
});