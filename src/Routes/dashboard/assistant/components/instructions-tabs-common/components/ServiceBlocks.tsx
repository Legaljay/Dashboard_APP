import React, { useState, Fragment, useCallback } from "react";
import { Popover } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import salesIcon from "@/assets/img/salesIcon.svg";
import enquiryIcon from "@/assets/img/enquiriesIcon.svg";
import complainIcon from "@/assets/img/complaintsIcon.svg";
import requestIcon from "@/assets/img/requestsIcon.svg";
import customIcon from "@/assets/img/customIcon.svg";
import customIcon1 from "@/assets/img/customIcon1.svg";
import customIcon2 from "@/assets/img/customIcon2.svg";

import {
  ThreeDots,
  BankIcon,
  RightChevron,
  Eye,
  Delete,
} from "@/assets/svg";
import { useAppDispatch } from "@/redux-slice/hooks";
import { AppCategory, deleteAppCategory } from "@/redux-slice/app-categories/app-categories.slice";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import DeleteService from "../modals/DeleteServiceModal";

interface ServiceBlocksProps {
  data: AppCategory;
  applicationId: string;
  handleFetchUpdate: () => void;
}


const ServicesBlocks: React.FC<ServiceBlocksProps> = ({ applicationId, data, handleFetchUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { openModal, closeModal } = useModal();

  const [loading, setLoading] = useState(false);
  const categoryId = data.id;


  const openDeleteModal = useCallback(() => {
    openModal(MODAL_IDS.custom('add-instruction'),
      <DeleteService
        loading={loading}
        handleClose={() => closeModal(MODAL_IDS.custom('add-instruction'))}
        handleDelete={handleRemoveService}  
        key={MODAL_IDS.custom('add-instruction')}
      />
    );
  }, [openModal, closeModal]);


  const handleRemoveService = async () => {
    try {
      const response = await dispatch(deleteAppCategory({ applicationId, categoryId })).unwrap();
      addToast('success', `Instruction has been Removed Successfully`);

        setTimeout(() => {
          handleFetchUpdate();
        }, 100);
    } catch (error) {
      addToast('error', 
        `An error occurred while removing ${data.name}, Please try again`
      );
    }
  };

  function hashToIndex(inputString: string) {
    // Calculate the sum of character codes in the input string
    if (!inputString) return 0;

    let sum = 0;
    for (let i = 0; i < inputString.length; i++) {
      sum += inputString.charCodeAt(i);
    }

    // Map the sum to one of the desired output values (0, 1, or 2)
    return sum % 3;
  }
  return (
    <>
      <div className="h-[158px] bg-[rgba(249,249,249,0.86)] dark:border dark:border-stone-800 dark:bg-stone-950/50 p-4 rounded-xl relative">
        <section className="flex justify-between">
          <div className="flex gap-3 text-base font-medium">
            <img src={data?.image_url} alt="sales" className="w-8 h-8" />
            <p className=" mt-1 text-[#121212] dark:text-stone-50 capitalize">{data.name}</p>
          </div>
        </section>
        <p className=" text-xs text-[#7F7F81] font-normal mt-[20px]">
          {data.description?.length > 80
            ? data.description.slice(0, 80) + "..."
            : data.description}
        </p>
        <section className="flex justify-between mt-5 w-full">
          <Link
            to={`/dashboard/assistant/${applicationId}/instructions/${data.id}/${data.name}`}
            className="flex items-center gap-2 text-[#0359D8]"
          >
            <p className="text-xs">Manage</p>
            <p className="">
              <RightChevron />
            </p>
          </Link>
          <Popover className="relative">
            <Popover.Button className="outline-none">
              <div className="mt-1 cursor-pointer">
                <ThreeDots />
              </div>
            </Popover.Button>
            <Popover.Panel>
              <Popover.Button className="z-10 cursor-pointer py-[5px] px-[10px] rounded-lg absolute bg-white dark:bg-stone-950 shadow-md right-3 flex flex-col gap-3">
                <div
                  onClick={() => navigate(`/dashboard/assistant/${applicationId}/instructions/${data.id}/${data.name}`)}
                  className="flex gap-3 items-center"
                >
                  <Eye />
                  <p className="text-xs text-[#121212] dark:text-stone-50 font-figtree">View</p>
                </div>
                {data.type === "custom" && (
                  <div
                    onClick={openDeleteModal}
                    className="flex gap-3 items-center"
                  >
                    <Delete />
                    <p className="text-xs text-[#AF202D] font-figtree">
                      Remove
                    </p>
                  </div>
                )}
              </Popover.Button>
            </Popover.Panel>
          </Popover>
        </section>
      </div>
    </>
  );
}
export default ServicesBlocks;


{/* {data.name.toLowerCase() === "complaints" ? (
              <img src={complainIcon} alt="complaints" className="w-8 h-8" />
            ) : data.name.toLowerCase() === "enquiries" ? (
              <img src={enquiryIcon} alt="enquiries" className="w-8 h-8" />
            ) : data.name.toLowerCase() === "requests" ? (
              <img src={requestIcon} alt="requests" className="w-8 h-8" />
            ) : data.name.toLowerCase() === "sales" ? (
              <img src={salesIcon} alt="sales" className="w-8 h-8" />
            ) : data.name.includes("Scheduled") ? (
              <img src={data?.image_url} alt="sales" className="w-8 h-8" />
            ) : hashToIndex(data.id) === 0 ? (
              <img src={customIcon} alt="sales" className="w-8 h-8" />
            ) : hashToIndex(data.id) === 1 ? (
              <img src={customIcon1} alt="sales" className="w-8 h-8" />
            ) : (
              <img src={customIcon2} alt="sales" className="w-8 h-8" />
            )} */}