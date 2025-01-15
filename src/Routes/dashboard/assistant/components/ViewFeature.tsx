import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";

import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { Table } from "@/components/ui/table";
import { fetchAppCategoryById } from "@/redux-slice/app-categories/app-categories.slice";
import { useToast } from "@/contexts/ToastContext";
import {
  publishAppInstruction,
  deleteAppInstruction,
  fetchAppInstructionById,
  fetchAppInstructions,
} from "@/redux-slice/app-instructions/app-instructions.slice";
import { TableColumn } from "@/components/ui/table/Table";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

const columns: TableColumn[] = [
  { header: "Instruction Name", accessorKey: "instruction" },
  { header: "Description", accessorKey: "description" },
  { header: "Support Channels", accessorKey: "support_channel" },
  { header: "Visibility", accessorKey: "visibility" },
  { header: "Action", accessorKey: "action" },
];

const fetchedDummyData = [
  {
    id: "1",
    instruction: "Instruction 1",
    description: "Description for instruction 1",
    support_channel: "Email, Phone",
    visibility: "Visible",
  },
  {
    id: "2",
    instruction: "Instruction 2",
    description: "Description for instruction 2",
    support_channel: "Chat",
    visibility: "Hidden",
  },
  // Add more data as needed
];

const ViewFeature: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { loading, instructions, selectedInstruction, error } = useAppSelector(
    (state) => state.appInstructions
  );
  const { assistantId: applicationId = "", id = "", type = "" } = useParams();
  const { addToast } = useToast();

  const [fetchedData, setFetchedData] = useState(fetchedDummyData);

  // useEffect(() => {
  //   // Simulate fetching data
  //   const fetchData = async () => {
  //     // Simulate a fetch delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     setFetchedData(fetchedDummyData); // Set your fetched data here
  //     setLoading(false); // Set loading to false after fetching
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    if (!applicationId) return;
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await dispatch(
        fetchAppInstructions({ applicationId, categoryId: id })
      ).unwrap();
      setFetchedData(res);
    } catch (error) {
      console.error(error);
    }
  }, [applicationId, dispatch, id]);

  const deleteInstruction = useCallback(
    async (instructionId: string) => {
      try {
        const res = await dispatch(
          deleteAppInstruction({ applicationId, categoryId: id, instructionId })
        ).unwrap();

        // fetchData();
        addToast("success", "Instruction deleted successfully!");
      } catch (error) {
        console.error(error);
      }
    },
    [applicationId, dispatch, id]
  );

  const publishInstruction = useCallback(
    async (instructionId: string) => {
      // setPublishLoading(instructionId);
      try {
        const res = await dispatch(
          publishAppInstruction({
            applicationId,
            categoryId: id,
            instructionId,
          })
        ).unwrap();

        // fetchData();
        addToast("success", "Instruction published successfully!");
        // if(!applicationId){
        // dispatch(getApplicationDraft(applicationId));
        // }
      } catch (error) {
        console.error(error);
      } finally {
        // setTimeout(() => {
        //   setPublishLoading(false);
        // }, 1000);
      }
    },
    [applicationId, dispatch, id]
  );

  const handleAddInstruction = useCallback(() => {
    navigate(`add-instruction`);
  }, [navigate, id]);

  return (
    <section className="flex font-figtree relative w-full">
      <main className="font-figtree w-full px-10 pb-10 mb-[100px] min-h-screen">
        <section className="flex flex-col gap-[33px]">
          <div className="flex justify-between w-full items-center">
            <div>
              <h2 className="text-[24px] font-medium capitalize text-[#121212] dark:text-gray-400">
                {type}
              </h2>
              {type.includes("Scheduled") && (
                <p className="text-[#7F7F81] text-[12px] leading-[18px]">
                  Schedule detailed instructions or guidelines for your
                  assistants within a given time period.
                </p>
              )}
            </div>
            <div className="gap-[12px] flex">
              {type.includes("Scheduled") && (
                <button
                  onClick={() => navigate(`archives`)}
                  className="outline-none py-3 w-auto px-5 bg-[#ffffff] dark:bg-background-dark rounded-lg text-[#828282] border border-neutral-100 dark:border-secondary-800 text-[14px] font-semibold"
                >
                  Archives
                </button>
              )}
              <button
                onClick={handleAddInstruction}
                className="outline-none py-3 w-auto px-5 bg-[#121212] dark:bg-BLUE-_100 rounded-lg text-white text-[14px] font-semibold"
              >
                Add Instructions
              </button>
            </div>
          </div>
          <Table
            // onRefresh={fetchData}
            columns={columns}
            data={fetchedData}
            isLoading={loading.fetchInstructions}
            onRowClick={() => {}}
            loadingMessage="Loading..."
            customEmptyStateMessage={() => (
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-[#121212] dark:text-white text-[16px] font-medium text-center">
                  You haven’t created any Instructions yet
                </p>
                <p className="text-center text-sm font-normal text-[#7F7F81] mt-1">
                  Create Instructions on what responses your assistant gives
                  <br /> your customers.
                </p>
                <Button
                  onClick={handleAddInstruction}
                  size="sm"
                  variant="black"
                  className="flex gap-2 items-center w-fit outline-none py-3 px-5 !bg-[#121212] dark:!bg-BLUE-_100 rounded-lg text-white text-[14px] font-semibold"
                >
                  <PlusIcon /> Add Instructions
                </Button>
              </div>
            )}
            enableSorting
            enableFiltering
            enablePagination
            enableSelection
            enableColumnVisibility
            enableResizing
            enableDragging
            enableVirtualization

            // enablePolling
            // pollingInterval={5000}
          />
          {/* <TestAgent /> */}
        </section>
      </main>
    </section>
  );
};

export default ViewFeature;
