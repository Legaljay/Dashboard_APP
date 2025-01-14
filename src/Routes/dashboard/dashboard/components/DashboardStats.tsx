import { memo, useCallback, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineCheck } from "react-icons/ai";
import { BsPlus } from "react-icons/bs";
import { Fragment } from "react";
import Purse from "@/assets/svg/purse.svg";
import Task from "@/assets/svg/task.svg";
import User from "@/assets/svg/user.svg";
import Skeleton from "@/components/ui/skeleton/Skeleton";
import { ModalChainStep, useModalChain } from "@/hooks/useModalChain";
import RedeemGiftModal from "@/components/ui/modals/pro-service-modals/components/RedeemGiftModal";
import RedeemSuccessModal from "@/components/ui/modals/pro-service-modals/components/RedeemSuccessModal";
import { MODAL_IDS } from "@/constants/modalIds";
import { useNavigate } from "react-router-dom";
import TopupModal from "@/components/ui/modals/pro-service-modals/components/TopupModal";
import PayModal from "@/components/ui/modals/pro-service-modals/components/PayModal";

interface StatsProps {
  walletBalance: string;
  firstRender: boolean;
  dashboardData: any;
  conversationWeek: { label: string; value: string };
  setConversationWeek: (week: { label: string; value: string }) => void;
  loading: boolean;
}

const DashboardStats = ({
  walletBalance,
  firstRender,
  dashboardData,
  conversationWeek,
  setConversationWeek,
  loading,
}: StatsProps) => {
  const { startChain, closeChain, nextInChain } = useModalChain();
  const navigate = useNavigate();

  const [amount, setAmount] = useState<number>(0);

  const convertedCredit = useMemo(
    () => (parseFloat(walletBalance) || 0).toFixed(2).toLocaleString(),
    [walletBalance]
  );

  const handleNavigate = useCallback(() => {
    navigate("/dashboard/wallet");
  }, [navigate]);

  const handleClose = useCallback(() => {
    closeChain();
  }, [])

  const handleRedeem = useCallback(() => {
    const steps = [
        {
            id: MODAL_IDS.custom("chain-1"),
            component: (
                <RedeemGiftModal
                    handleClose={handleClose}
                    refresh={handleNavigate}
                    back={handleClose}
                    handleNext={nextInChain}
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
        {
            id: MODAL_IDS.custom("chain-2"),
            component: (
              <RedeemSuccessModal
                handleClose={handleClose}
                title={"Redeem Successful"}
                text1={"You have successfully redeemed your Gift Credits"}
                label={"Done"}
                redirectPath="/dashboard/billing"
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
    ]

    startChain(steps as ModalChainStep[]);
  }, []);


  const handleTopUp = useCallback(() => {
    const steps = [
        {
            id: MODAL_IDS.custom("chain-1"),
            component: (
                <TopupModal
                handleClose={handleClose}
                handleNext={nextInChain}
                setAmount={setAmount}
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
          {
            id: MODAL_IDS.custom("chain-2"),
            component: (
              <PayModal
                handleClose={handleClose}
                handleNext={nextInChain}
                payAmount={amount}
                is_sufficient
              />
            ),
            options:{
              preventScroll: true,
              size: "xl",
            }
          },
    ]
    startChain(steps as ModalChainStep[]);
  }, []);

  const PeriodSelector = useCallback(
    () => (
      <Menu as="div" className="relative text-left">
        <Menu.Button className="flex items-center text-xs text-BLACK-_300">
          {conversationWeek.label}
          <BiChevronDown
            className="ml-2 -mr-1 h-5 w-5 text-[#828282]"
            aria-hidden="true"
          />
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
          <Menu.Items className="absolute right-0 mt-2 w-[142px] origin-top-right rounded-md bg-white  shadow-lg ring-1 ring-black/5 focus:outline-none">
            {[
              { label: "Today", value: "today" },
              { label: "This Week", value: "week" },
              { label: "This Month", value: "month" },
              { label: "This Year", value: "year" },
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
                    {active && (
                      <AiOutlineCheck className="mr-2 h-5 w-5 text-[#1774FD]" />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    ),
    []
  );

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
      <div className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl step-1 shadow-boxShadow dark:shadow-xl bg-dashboard-stats-card-background dark:bg-BLUE-_100 dark:bg-dashboard-stats-card-background-dark">
        <div className="flex justify-between">
          <img src={Purse} alt="wallet" />
          <button className="flex gap-1" onClick={handleTopUp}>
            <BsPlus className="text-BLUE-_200" />
            <p className="text-xs text-BLUE-_200">Top-up</p>
          </button>
        </div>
        <div className="flex flex-col w-[119px] h-[40px] mt-6 gap-2">
          <p className="text-xs text-BLACK-_300">Credits</p>
          <p className="text-2xl font-semibold text-BLACK-_600 dark:text-WHITE-_100">
            ${convertedCredit.toLowerCase() !== "nan" ? convertedCredit : 0}
          </p>
        </div>
      </div>

      {/* Average Resolutions Card */}
      <div
        className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl shadow-boxShadow dark:shadow-xl bg-[#FAFAFA] dark:bg-dashboard-stats-card-background-dark"
      >
        <div className="flex justify-between items-center">
          <img src={Task} alt="task" />
          <PeriodSelector />
        </div>
        <p className="mt-6 text-xs font-medium text-BLACK-_300">
          Average Resolutions
        </p>
        <div className="flex flex-col w-[107px] h-[36px] mt-[6px]">
          <p className="text-2xl font-semibold text-BLACK-_600 dark:text-WHITE-_100">
            {dashboardData?.tasks?.average || 0}
          </p>
          <p className="text-GREEN-_200 text-[10px]">
            {dashboardData?.increase?.increaseInConversationsPercentage || 0}%
            More than last week
          </p>
        </div>
      </div>

      {/* New Users Card */}
      <div
        className="w-[33.3%] h-[170px] py-5 px-3.5 rounded-xl shadow-boxShadow dark:shadow-xl bg-[#FAFAFA] dark:bg-dashboard-stats-card-background-dark"
      >
        <div className="flex justify-between items-center">
          <img src={User} alt="user" />
          <PeriodSelector />
        </div>
        <p className="mt-6 text-xs font-medium text-BLACK-_300">New Users</p>
        <div className="flex flex-col w-[107px] h-[36px] mt-[6px]">
          <p className="text-2xl font-semibold text-BLACK-_600 dark:text-WHITE-_100">
            {dashboardData?.totalNewUsers || 0}
          </p>
          <p className="text-GREEN-_200 text-[10px]">
            {dashboardData?.increase?.increaseInCustomersPercentage || 0}% More
            than last week
          </p>
        </div>
      </div>
    </div>
  );
};

DashboardStats.displayName = "DashboardStats";

export default memo(DashboardStats);
