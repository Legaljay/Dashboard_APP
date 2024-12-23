import React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  path: string;
  label: string;
  icon?: React.ElementType;
}

export const assistantNavItems: NavItem[] = [
  { path: "memory", label: "Memory" },
  { path: "instructions", label: "Instructions" },
  { path: "settings", label: "Settings" },
  { path: "test-launch", label: "Test/Launch" },
];
const Aside: React.FC = React.memo(() => {
  return (
    <aside>
      <ul className="space-y-4 px-2">
        {assistantNavItems.map((item) => {
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex rounded-lg transition-transform font-medium text-sm text-start p-[10px_16px] w-[135px] transform outline-none ${
                    (isActive && item.path === "") ||
                    (window.location.pathname.includes(item.path) &&
                      item.path !== "/assistant")
                      ? "bg-[#FAFAFA] text-primary-500 rounded-md dark:bg-primary-900/20 dark:text-primary-500"
                      : "text-gray-500 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-secondary-800"
                  }`
                }
                end={item.path === "assistant"}
              >
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
});

export default Aside;
