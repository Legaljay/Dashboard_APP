import React, { Fragment, useState, memo, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiRobot2Line,
  RiCodeLine,
  RiEdgeLine,
  RiSettings4Line,
  RiCustomerService2Line,
  RiWalletLine,
  RiAiGenerate,
} from "react-icons/ri";
import { motion } from "framer-motion";
import { MdPersonOutline } from "react-icons/md";
import { FaAppStore } from "react-icons/fa";
import Logo from "@/assets/img/Logo.png";
import MiniLogo from "@/assets/wano logo 1 1.png";
import { Menu, Transition } from "@headlessui/react";
import { AddBlue, ArrowRight, ArrowRightBlack } from "@/assets/svg";
import { useAppSelector, useAppDispatch } from "@/redux-slice/hooks";
import { Application } from "@/types/applications.types";
import {
  selectSelectedApplication,
  setSelectedApplication,
} from "@/redux-slice/applications/applications.slice";

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: RiDashboardLine },
  { path: "/dashboard/assistant", label: "Assistant", icon: RiRobot2Line },
  {
    path: "/dashboard/ask-assistant",
    label: "Ask Assistant",
    icon: RiAiGenerate,
  },
  { path: "/dashboard/analytics", label: "Analytics", icon: RiRobot2Line },
  { path: "/dashboard/deploy", label: "Deploy", icon: RiCodeLine },
  { path: "/dashboard/widget", label: "Widget", icon: RiEdgeLine },
  { path: "/dashboard/customers", label: "Customer", icon: MdPersonOutline },
  { path: "/dashboard/conversations?team=default&main=dashboard", label: "Conversation", icon: RiRobot2Line },
  { path: "/dashboard/appstore", label: "AppStore", icon: FaAppStore },
];

const bottomNavItems: NavItem[] = [
  { path: "/dashboard/billing", label: "Billings", icon: RiWalletLine },
  { path: "/dashboard/settings", label: "Settings", icon: RiSettings4Line },
  {
    path: "/dashboard/support",
    label: "Support",
    icon: RiCustomerService2Line,
  },
];

export const Sidebar: React.FC = memo(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const active = window.location.pathname;
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const applications = useAppSelector(
    (state) => state.applications.applications
  );
  const selectedApplication = useAppSelector(selectSelectedApplication);
  const activeBusiness = useAppSelector((state) => state.business.activeBusiness);

  const handleAssistantSelection = useCallback(
    (application: Application) => {
      dispatch(setSelectedApplication(application.id));
    },
    [dispatch]
  );

  const handleNavigateToCustomizeAssistant = useCallback(() => {
    navigate(`/auth/customize-assistant/${activeBusiness?.id}`, { state: { fromDashboard: true } });
  }, [navigate, activeBusiness?.id]);

  const handleSidebarToggle = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [setIsCollapsed, isCollapsed]);

  //TODO: scale down into components and wrap with memo
  
  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white dark:bg-background-dark border-r border-gray-200 dark:border-secondary-800"
    >
      <div className="flex flex-col h-full">
        {/* Logo border-b border-gray-200 */}
        <div
          className={`relative h-16 mt-[21px] flex ${
            isCollapsed ? "justify-center" : ""
          } items-center px-4  dark:border-secondary-800`}
        >
          <img
            src={!isCollapsed ? Logo : MiniLogo}
            className="h-[25px]"
            alt="logo"
          />
          <button
            onClick={handleSidebarToggle}
            className={`absolute border border-[#D7D7D7] dark:border-secondary-800 bg-white dark:dark:bg-gray-800 -right-4 top-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary-800 transition-colors transform ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
          {/* Assistant Navigation Items */}
          {selectedApplication?.name && active !== "/getstarted" && (
            <Menu as="div" className="relative space-y-1 mb-4 px-3">
              <Menu.Button
                className={`w-full flex items-center rounded-lg cursor-pointer border-[#E5E5E5] dark:border-secondary-800 border ${
                  isCollapsed
                    ? "py-2 px-4 justify-between "
                    : "px-3 py-2 justify-center"
                }`}
              >
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 bg-[#1774FD] rounded-full flex justify-center items-center">
                    <p className="capitalize text-white text-[7.5px] font-medium">
                      {selectedApplication?.name?.charAt(0)}
                    </p>
                  </div>
                  {!isCollapsed && (
                    <p className="break-all max-w- capitalize text-xs text-[#121212] dark:text-gray-300 truncate">
                      {selectedApplication?.name.substring(0, 20) +
                        (selectedApplication?.name.length > 20 ? "..." : "")}
                    </p>
                  )}
                </div>
                {isCollapsed && <ArrowRight />}
              </Menu.Button>

              {/* Toggle agent */}
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-[9999] absolute left-4 top-12 w-[198px] rounded-md bg-white dark:dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="py-[18px] px-4">
                    <p className="mb-6 text-[#828282] text-sm">
                      Select Assistant
                    </p>
                    {applications?.map((d, id) => {
                      return (
                        <Menu.Item key={id}>
                          <div
                            onClick={() => handleAssistantSelection(d)}
                            className="cursor-pointer mb-2 py-[9px] px-3 border border-[#E5E5E5] rounded-[6px] flex items-center justify-between"
                          >
                            <div className="flex gap-2 items-center">
                              <div className="w-4 h-4 bg-[#1774FD] rounded-lg flex justify-center items-center">
                                <p className="capitalize text-white text-[7.5px] font-medium">
                                  {d?.name?.charAt(0)}
                                </p>
                              </div>
                              <p className="text-xs text-[#121212] dark:text-gray-300 capitalize">
                                {d?.name}
                              </p>
                            </div>
                            <ArrowRightBlack className="dark:text-gray-300"/>
                          </div>
                        </Menu.Item>
                      );
                    })}
                    <Menu.Item>
                      <div
                        onClick={handleNavigateToCustomizeAssistant}
                        className="cursor-pointer bg-[#F9F9F9] dark:dark:bg-gray-800 rounded-lg h-8 py-[9px] flex justify-center items-center gap-2"
                      >
                        <AddBlue />
                        <p className="text-xs text-blue-600 dark:text-gray-300 font-medium">
                          Add New Assistant
                        </p>
                      </div>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          <div
            onClick={handleNavigateToCustomizeAssistant}
            className="space-y-1 mb-4 px-3"
          >
            <div className="cursor-pointer text-[#1774FD] dark:bg-[#F9F9F9] rounded-lg h-8 py-[9px] flex justify-center items-center gap-2">
              {!isCollapsed && <AddBlue />}

              <p className="text-xs text-PRIMARY font-medium">
                Add
                {!isCollapsed ? " New Assistant" : ""}
              </p>
            </div>
          </div>

          {/* Main Navigation Items */}
          <ul className="space-y-1 px-3">
            {mainNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg transition-colors ${
                        (isActive && item.path === "/dashboard") || 
                        (window.location.pathname.startsWith(item.path) && item.path !== "/dashboard")
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-500"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-secondary-800"
                      }`
                    }
                    end={item.path === "/dashboard"}
                  >
                    <Icon
                      className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"}`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* Bottom Navigation Items */}
          <ul className="space-y-1 px-3 mt-auto">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-lg transition-colors ${
                        (isActive && item.path === "/dashboard") || 
                        (window.location.pathname.startsWith(item.path) && item.path !== "/dashboard")
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-500"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-secondary-800"
                      }`
                    }
                  >
                    <Icon
                      className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"}`}
                    />
                    {!isCollapsed && <span>{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-secondary-800">
          {!isCollapsed && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
});
