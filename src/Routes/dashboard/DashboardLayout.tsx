import React, { Fragment, useState, useMemo, useCallback } from "react";
import { useMatch, useNavigate, useLocation } from "react-router-dom";
import { Bell, Down, Help, Check, Add } from "@/assets/svg";
import help from "@/assets/svg/help.svg";
import { HiXMark } from "react-icons/hi2";
import { Menu, Transition } from "@headlessui/react";
import { Sidebar } from "@/components/ui/sidebar/Sidebar";
// import { useToast } from "@/contexts/ToastContext";
import { FaPlus } from "react-icons/fa";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import {
  switchBusiness,
  setBusiness,
  selectBusinessData,
} from "@/redux-slice/business/business.slice";
import { fetchApplications, resetState } from "@/redux-slice/applications/applications.slice";
import TokenService from "@/utils/token";
import ChangesBanner from "@/components/ui/modals/ChangesBanner";
import ProFeatures from "@/components/ui/modals/pro-service-modals";
import TestAssistant from "./assistant/components/test-assistant-modal/TestAssistant";
import { clearCredentials } from "@/redux-slice/auth/auth.slice";

interface Business {
  id: string;
  name: string;
  website_url: string;
  description: string;
  country: string;
  business_email: string;
  team_size: string;
  category: string;
  purpose: string;
  subscription_plan: string | null;
  setup_assist_count: number;
  setup_assist_date: string;
  team: any[];
  created_at: string;
  updated_at: string;
}

interface Profile {
  first_name: string;
  last_name: string;
}

interface Notification {
  id: string;
  // Add other notification properties as needed
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { addToast, removeToast } = useToast();
  const active = useMatch("/getstarted");
  const dispatch = useAppDispatch();

  const profileData = useAppSelector((state) => state.user.profile);

  // const { businessData, activeBusiness } = useAppSelector((state) => ({
  //   businessData: state.business.businesses,
  //   activeBusiness: state.business.activeBusiness,
  // }));
  
  const { businessData, activeBusiness } = useAppSelector(selectBusinessData);
  const notificationData = useAppSelector(
    (state) => state.notifications.notifications
  );

  const [unreadCount, setUnreadCount] = useState(1);
  const [_,setIsMenuOpen] = useState(false);
  const [skip] = useState(true);
  const [user] = useState(null);


  const logout = useCallback(async () => {
    try {
      await TokenService.removeToken();
      dispatch(clearCredentials());
      dispatch(resetState());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }, [navigate]);

  const handleBusinessSelection = useCallback(async (business: Business) => {
    try {
      // Then switch to the new business (this handles any additional side effects)
      const response = await dispatch(switchBusiness(business.id)).unwrap();
      // Set the active business in the state
      if (response.status) {
        dispatch(setBusiness({ ...business }));
        dispatch(fetchApplications());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  const handleSetupAssistanceClick = useCallback(async () => {
    // Implement setup assistance logic
  }, []);

  const handleAddBusiness = useCallback(() => {
    navigate("/auth/company", { state: { fromDashboard: true } });
  }, [navigate]);

  const handleCloseDropdown = useCallback(() => {
    // Implement dropdown closing logic
    setIsMenuOpen(false);
  }, []);

  const clearNotification = useCallback((id: string) => {
    // Implement notification clearing logic
  }, []);

  const clearAllNotifications = useCallback(() => {
    // setNotificationData([]);
    setUnreadCount(0);
  }, []);

  const clearNotificationsSafely = useCallback(() => {
    // Implement safe notification clearing logic
  }, []);

  // Add DashboardLayout Title for path segments
  const title = useMemo(() => {
    // Remove leading slash and split into parts
    const path = location.pathname.slice(1).split("/");

    // Get the last meaningful segment of the path
    const lastSegment =
      path[path.length - 1] || path[path.length - 2] || "dashboard";

    // Convert to title case and replace hyphens with spaces
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [location.pathname]);

  return (
    <div className="flex overflow-hidden w-full h-full bg-white transition-colors duration-200 dark:bg-background-dark">
      <aside>
        <Sidebar />
      </aside>

      <div className="w-full rounded">
        <header className="flex justify-between items-center px-10 py-4 w-full border-b border-gray-200 dark:border-secondary-800">
          <div>
            <p className="text-[18px] font-medium text-[#101828] dark:text-[#ccc] capitalize">
              {title}
            </p>
          </div>
          <div className="flex gap-3 items-center cursor-pointer">
            <div
              className="bg-[#F0F6FF] dark:bg-secondary-800 rounded-[45px] py-[9px] px-[10px] flex items-center gap-[4px] cursor-pointer"
              onClick={handleSetupAssistanceClick}
            >
              <img src={help} alt="help icon" />
              <span className="text-[12px] leading-[14.4px] text-[#535353] dark:text-[#ccc] font-medium">
                Setup Assistance
              </span>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button
                className={`gap-[10px] items-center ${
                  active ? "hidden" : "flex"
                }`}
              >
                <div className="w-8 h-8 bg-[#1774FD] rounded-lg justify-center items-center flex">
                  <p className="text-white text-[16px] font-bold capitalize">
                    {profileData?.first_name[0]}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="capitalize text-sm text-[#535353] text-start">
                    {activeBusiness?.name}
                  </p>
                </div>
                <div>
                  <Down />
                </div>
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
                <Menu.Items className="z-10 absolute right-0 mt-6 w-[240px] origin-top-right rounded-md bg-white dark:dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="">
                    <div className="flex gap-3 items-center px-4 py-3">
                      <div className="w-8 h-8 bg-[#1774FD] rounded-lg justify-center items-center flex">
                        <p className="text-white text-[16px] font-bold capitalize">
                          {profileData?.first_name[0]}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-[#121212] dark:text-white text-start capitalize">
                          {profileData?.first_name} {profileData?.last_name}
                        </p>
                        <p className="text-sm text-[#828282] capitalize">
                          {activeBusiness?.name}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-[6px]">
                      <p className="text-xs font-medium text-[#A7A7A7]">
                        Switch business
                      </p>
                    </div>
                    <div className="overflow-y-scroll max-h-52">
                      {businessData?.map((b, id) => {
                        return (
                          <Menu.Item key={id}>
                            <button
                              className="hover:bg-[#FAFAFA] hover:dark:bg-secondary-800 capitalize group flex text-[#121212] justify-between w-full items-center px-4 py-[9px] font-medium text-sm"
                              onClick={() => handleBusinessSelection(b)}
                            >
                              {b?.name}
                              {activeBusiness?.id === b?.id && (
                                <Check className="mr-2" />
                              )}
                            </button>
                          </Menu.Item>
                        );
                      })}
                    </div>

                    <Menu.Item>
                      <div onClick={handleCloseDropdown}>
                        <ProFeatures
                          className="hover:bg-[#FAFAFA] hover:dark:bg-secondary-800 group flex text-[#121212] dark:text-white justify-between w-full items-center px-4 py-[9px] font-medium text-sm"
                          text="Add New Business"
                          icon={() => <FaPlus />}
                          originalButton={
                            <button
                              className="hover:bg-[#FAFAFA] hover:dark:bg-secondary-800 group flex text-[#121212] dark:text-white justify-between w-full items-center px-4 py-[9px] font-medium text-sm"
                              onClick={handleAddBusiness}
                            >
                              <div className="flex gap-2 items-center">
                                <FaPlus className="text-[#a7a7a7] dark:text-white" />
                                <p>Add New Business</p>
                              </div>
                            </button>
                          }
                          type="assistant"
                        />
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        className="hover:bg-[#FAFAFA] hover:dark:bg-secondary-800 group flex text-[#AF202D] justify-between w-full items-center px-4 py-[9px] font-medium text-sm"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {skip || user ? (
              <Menu as="div" className="relative">
                <Menu.Button
                  className={`border p-2 border-[#F7F7F7] dark:border-secondary-800 rounded-lg ${
                    unreadCount > 0 ? "relative" : ""
                  }`}
                >
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="flex absolute top-0 right-0 justify-center items-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
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
                  <Menu.Items className="z-[9999] absolute right-0 mt-1 w-[482px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="pt-[15px]">
                      <Menu.Item>
                        <div className="px-6 flex items-center justify-between mb-[14px]">
                          <p className="text-[#101828] text-[18px] font-medium">
                            Notifications
                          </p>
                          <div className="border p-2 -mt-1 rounded-lg border-[#F7F7F7] cursor-pointer">
                            <HiXMark className="text-[20px] text-[#828282]" />
                          </div>
                        </div>
                      </Menu.Item>
                      <hr className="bg-[#F7F7F7]" />
                      {notificationData?.length > 0 ? (
                        <>
                          <p
                            onClick={clearAllNotifications}
                            className="my-4 px-6 text-xs font-medium text-[#1774FD] cursor-pointer"
                          >
                            Mark all as read
                          </p>
                          {notificationData?.map((notification, id) => {
                            return (
                              <Menu.Item as="div" key={id}>
                                {/* Replace with your Notifications component */}
                                <div
                                  onClick={() =>
                                    clearNotification(notification.id)
                                  }
                                >
                                  Notification Item
                                </div>
                              </Menu.Item>
                            );
                          })}
                        </>
                      ) : (
                        <div className="flex justify-center items-center p-6">
                          <p>No Notifications!</p>
                        </div>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : null}
            <div
              className="cursor-pointer border p-2 border-[#F7F7F7] dark:border-secondary-800 rounded-lg"
              onClick={() => navigate("/dashboard/support")}
            >
              <Help />
            </div>
          </div>
        </header>
        <main className="flex-1 px-2 pt-3 pb-8 w-full h-full">
          <ChangesBanner />
          <BreadCrumbs />
          <div className="overflow-y-auto w-full h-full smooth-scroll hide-scrollbar">{children}</div>
          <TestAssistant/>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
