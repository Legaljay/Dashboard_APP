import { memo, useCallback, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BiChevronDown } from 'react-icons/bi';
import { AiOutlineCheck } from 'react-icons/ai';
import { BsPlus } from 'react-icons/bs';
import { Fragment } from 'react'; 
import Purse from '@/assets/svg/purse.svg';
import Task from '@/assets/svg/task.svg';
import User from '@/assets/svg/user.svg';
import Skeleton from '@/components/ui/skeleton/Skeleton';

interface StatsProps {
  walletBalance: string;
  firstRender: boolean;
  dashboardData: any;
  conversationWeek: { label: string; value: string };
  setConversationWeek: (week: { label: string; value: string }) => void;
  setOpenTopUp: (open: boolean) => void;
  loading: boolean;
}

const DashboardStats = ({
  walletBalance,
  firstRender,
  dashboardData,
  conversationWeek,
  setConversationWeek,
  setOpenTopUp,
  loading,
}: StatsProps) => {
  const convertedCredit =  useMemo(() => (parseFloat(walletBalance) || 0).toFixed(2).toLocaleString(), [walletBalance]);

  const PeriodSelector = useCallback(() => (
    <Menu as="div" className="relative text-left">
      <Menu.Button className="flex items-center text-xs text-BLACK-_300">
        {conversationWeek.label}
        <BiChevronDown className="ml-2 -mr-1 h-5 w-5 text-[#828282]" aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-[142px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          {[
            { label: "Today", value: "today" },
            { label: "This Week", value: "week" },
            { label: "This Month", value: "month" },
            { label: "This Year", value: "year" }
          ].map((period) => (
            <Menu.Item key={period.value}>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-[#F9FAFB] text-[#121212]" : "text-gray-900"
                  } group flex justify-between w-full items-center px-2 py-2 text-sm`}
                  onClick={() => setConversationWeek(period)}
                >
                  {period.label}
                  {active && <AiOutlineCheck className="mr-2 h-5 w-5 text-[#1774FD]" />}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  ), []);

  if (loading && firstRender) {
    return (
      <div className="flex gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="w-[33.3%] h-[159px] rounded-xl bg-gray-100/80"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 mt-6">
      {/* Credits Card */}
      <div className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl step-1"
        style={{
          boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)",
          background: "linear-gradient(90deg, #F7F7F7 0%, rgba(250, 250, 250, 0.48) 52.26%, #F7F7F7 100.19%)",
        }}>
        <div className="flex justify-between">
          <img src={Purse} alt="wallet" />
          <button className="flex gap-1" onClick={() => setOpenTopUp(true)}>
            <BsPlus className="text-BLUE-_200" />
            <p className="text-xs text-BLUE-_200">Top-up</p>
          </button>
        </div>
        <div className="flex flex-col w-[119px] h-[40px] mt-6 gap-2">
          <p className="text-xs text-BLACK-_300">Credits</p>
          <p className="text-2xl font-semibold text-BLACK-_600">
            ${convertedCredit.toLowerCase() !== "nan" ? convertedCredit : 0}
          </p>
        </div>
      </div>

      {/* Average Resolutions Card */}
      <div className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl bg-[#FAFAFA]"
        style={{ boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)" }}>
        <div className="flex justify-between items-center">
          <img src={Task} alt="task" />
          <PeriodSelector />
        </div>
        <p className="mt-6 text-xs font-medium text-BLACK-_300">Average Resolutions</p>
        <div className="flex flex-col w-[107px] h-[36px] mt-[6px]">
          <p className="text-2xl font-semibold text-BLACK-_600">
            {dashboardData?.tasks?.average || 0}
          </p>
          <p className="text-GREEN-_200 text-[10px]">
            {dashboardData?.increase?.increaseInConversationsPercentage || 0}% More than last week
          </p>
        </div>
      </div>

      {/* New Users Card */}
      <div className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl"
        style={{ boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)" }}>
        <div className="flex justify-between items-center">
          <img src={User} alt="user" />
          <PeriodSelector />
        </div>
        <p className="mt-6 text-xs font-medium text-BLACK-_300">New Users</p>
        <div className="flex flex-col w-[107px] h-[36px] mt-[6px]">
          <p className="text-2xl font-semibold text-BLACK-_600">
            {dashboardData?.totalNewUsers || 0}
          </p>
          <p className="text-GREEN-_200 text-[10px]">
            {dashboardData?.increase?.increaseInCustomersPercentage || 0}% More than last week
          </p>
        </div>
      </div>
    </div>
  );
};

DashboardStats.displayName = 'DashboardStats';

export default memo(DashboardStats);
