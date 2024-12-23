import React from "react";
import { Switch } from "@headlessui/react";
import { Popover } from "@headlessui/react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";
import { Eye, Delete } from "@/assets/svg";
import { MemoryFile } from "../types";
import Skeleton from "@/components/ui/skeleton/Skeleton";

interface MemoryTableProps {
  data: MemoryFile[];
  loading: boolean;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  deleteLoading: Record<string, boolean>;
  publishLoading: Record<string, boolean>;
  activeTab?: string;
}

export const MemoryTable: React.FC<MemoryTableProps> = React.memo(
  ({ data, loading, onDelete, onActivate, deleteLoading, publishLoading, activeTab }) => {
    if (loading) {
      return (
        <div className="flex flex-col gap-2 justify-center w-full">
          <Skeleton className="h-12 w-full flex items-center justify-center">
            <div className="bg-[#FAFAFA] w-full h-6 mix-blend-soft-light" />
          </Skeleton>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <table className="fixed-width-table w-full">
          <thead>
            <tr>
              <th>
                <div className="flex items-center">Source</div>
              </th>
              <th>File type</th>
              <th>Status</th>
              <th>Visibility</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="w-full pt-16">
                <p className="text-[rgba(130,130,130,1)] text-lg font-medium text-center">
                  No Memory Records Found in {activeTab &&activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1)} Section
                </p>
                <p className="text-center text-sm font-normal text-[#828282]">
                  It seems we don't have any records of your Assistant's memory
                  at the moment.
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <table className="fixed-width-table w-full">
        <thead>
          <tr>
            <th>
              <div className="flex items-center">Source</div>
            </th>
            <th>File type</th>
            <th>Status</th>
            <th>Visibility</th>
            <th>Action</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-[#F7F7F7]">
              <td className="flex truncate items-center pl-[20px] py-[20px] text-[#121212] font-normal text-sm">
                <span className="truncate">{item.name}</span>
              </td>
              <td className="text-[#121212] font-normal text-sm capitalize">
                {item.name.split(".").slice(-1)}
              </td>
              <td className="text-[#121212] font-normal text-sm">
                <div className="text-[#057601] text-xs font-normal px-2 py-1 rounded-[28px] border border-solid border-[#059c00] bg-[#BBFDB9] w-min">
                  {item.status}
                </div>
              </td>
              <td className="text-[#121212] font-normal text-sm">
                {publishLoading[item.id] ? (
                  <CgSpinner className="animate-spin text-lg" />
                ) : (
                  <Switch
                    checked={item.draft ? item.draft.active : item.active}
                    onChange={() => onActivate(item.id)}
                    className={`${
                      (item.draft ? item.draft.active : item.active)
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable notifications</span>
                    <span
                      className={`${
                        (item.draft ? item.draft.active : item.active)
                          ? "translate-x-2"
                          : "translate-x-1"
                      } absolute inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                )}
              </td>
              <td className="text-[#121212] font-normal text-sm">
                <Popover className="relative">
                  <Popover.Button className="outline-none">
                    <PiDotsThreeVerticalBold className="cursor-pointer text-base text-[#121212]" />
                  </Popover.Button>
                  <Popover.Panel>
                    <Popover.Button className="cursor-pointer py-[5px] px-[10px] rounded-lg z-10 absolute bg-white shadow-md right-3 flex flex-col gap-3">
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3"
                      >
                        <Eye />
                        <p className="text-xs text-[#121212] font-figtree">
                          View
                        </p>
                      </a>
                      <div className="flex gap-2">
                        {deleteLoading[item.id] ? (
                          <CgSpinner className="animate-spin text-lg" />
                        ) : (
                          <div
                            className="flex gap-3 cursor-pointer"
                            onClick={() => onDelete(item.id)}
                          >
                            <Delete />
                            <p className="text-xs text-[#121212] font-figtree">
                              Delete
                            </p>
                          </div>
                        )}
                      </div>
                    </Popover.Button>
                  </Popover.Panel>
                </Popover>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

MemoryTable.displayName = "MemoryTable";
