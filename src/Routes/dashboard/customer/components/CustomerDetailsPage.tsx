import { AnimatePresence } from "framer-motion";
import { memo, useCallback, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
}

interface Conversation {
  id: string;
  created_at: string;
}

const mainNavItems: NavItem[] = [
  { path: "conversation", label: "Conversation" },
  { path: "summary", label: "Summary" },
  { path: "notes", label: "Notes" },
];

const customer =
  // [
  {
    id: "18989y8y98",
    name: "Adesina Ayobami",
    email: "ade@gmail.com",
    phone_number: "08034333467",
    time_of_first_session: new Date().toISOString(),
    time_of_last_session: new Date().toISOString(),
    conversations: [
      {
        id: "ab",
        created_at: new Date().toISOString(),
      },
      {
        id: "ac",
        created_at: new Date().toISOString(),
      },
      {
        id: "ad",
        created_at: new Date().toISOString(),
      },
    ],
    notes: [
      {
        id: "1",
        content: "Customer prefers email communication",
        timestamp: new Date().toISOString(),
      },
    ],
  };
// ]

const CustomerDetailsPage = () => {
  const [ activeConversationHistory, setActiveConversationHistory ] = useState<Conversation | null>(customer.conversations[0]);
  const formatISODate = useCallback((isoDate: string) => {
    const date = new Date(isoDate);

    const getDayWithSuffix = (day: number) => {
      if (day > 3 && day < 21) return day + "th"; // Special case for teens
      switch (day % 10) {
        case 1:
          return day + "st";
        case 2:
          return day + "nd";
        case 3:
          return day + "rd";
        default:
          return day + "th";
      }
    };

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = getDayWithSuffix(date.getUTCDate());
    const month = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day}, ${month} ${year}`;
  }, []);

  return (
    <div className="px-10 pt-4 pb-12">
      <p className="text-2xl font-medium capitalize">{customer.name}</p>
      <div className="mt-10">
        {/* details  */}
        <p className="text-base font-medium">Details</p>
        <div className="mt-6 grid grid-cols-5 gap-x-10 gap-y-[50px]">
          <div className="flex flex-col gap-1">
            <p className="customerHeader">Full name</p>
            <p className="text-sm">{customer.name}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-BLACK-_300">Email</p>
            <p className="text-sm break-all">{customer.email}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-BLACK-_300">Phone Number</p>
            <p className="text-sm break-all">{customer.phone_number ?? "__"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-BLACK-_300">Last Seen</p>
            <p className="text-sm break-all">
              {formatISODate(customer.time_of_first_session)}
            </p>
          </div>{" "}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-BLACK-_300">First Seen</p>
            <p className="text-sm break-all">
              {formatISODate(customer.time_of_last_session)}
            </p>
          </div>
        </div>
        {/* CONVERSATION HISTORY  */}
        <p className="mt-16 mb-6 text-base font-medium">Conversation History</p>
        <div className="grid grid-cols-10 gap-8">
          <div className="flex overflow-y-auto flex-col col-span-3 gap-4">
            {customer.conversations.map((convo, index) => (
              <div
                key={index}
                className={`text-BLACK-_300 bg-[#FDFDFD] hover:text-BLUE-_200 hover:bg-[#F4F9FF]  border border-chatBrown cursor-pointer rounded-lg px-6 py-4
                      ${
                        activeConversationHistory?.id === convo.id
                          ? " text-BLUE-_200 bg-[#F4F9FF] "
                          : ""
                      }`}
                onClick={() => {
                  setActiveConversationHistory(convo);
                //   checkIfSummaryExists(convo);
                }}
              >
                {formatISODate(convo.created_at)}
              </div>
            ))}
          </div>
          <div className="col-span-7 p-5 px-6 rounded-lg border border-BLACK-_400">
            <p className="mb-6 text-xs font-medium">
              {/* {formatISODate(activeConversationHistory.created_at)} */}
            </p>
            <nav className="flex gap-1 mb-8 pb-2 border-b border-b-[#eee]">
              <div className="">
                {mainNavItems.map((item) => {
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `tab-button transition-colors ${
                          isActive ? "active" : ""
                        }`
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <Outlet context={{ customerData: customer }} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;
