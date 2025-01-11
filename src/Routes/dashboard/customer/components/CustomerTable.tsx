import { Table } from "@/components/ui/table";
import { memo, useCallback } from "react";
import skeletonImage from "@/assets/svg/skeletonImage.svg";
import { useNavigate } from "react-router-dom";

type CustomerTableProps = {
  customers: any[];
  loading: boolean;
  page: number;
};

const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
  
const dummyData = [
    {
        id: uuidv4(),
        name: "Adesina Ayobami",
        email: "ade@gmail.com",
        phone_number: "08034333467",
        time_of_last_session: "20007890777"
    }
]

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  page,
}) => {
    const navigate = useNavigate();
    
    const handleRowClick = useCallback((id: string) => { navigate(`${id}/conversation`)}, [navigate])
  
    
  return (
    <Table
      columns={[
        { header: "Customer", accessorKey: "name" },
        { header: "Email Address", accessorKey: "email" },
        { header: "Phone Number", accessorKey: "phone_number" },
        { header: "Last Seen", accessorKey: "time_of_last_session" },
      ]}
      data={dummyData}
      customEmptyStateMessage={() => (
        <tr>
          <td colSpan={5} className="py-16 w-full">
            <div className="flex justify-center">
              <img
                src={skeletonImage}
                alt="template"
                className="w-[237px] h-[25px] mb-5"
              />
            </div>

            <p className="text-[rgba(130,130,130,1)] text-lg font-medium text-center">
              No Customers Yet
            </p>
            <p className=" text-center text-sm font-normal text-[#828282]">
              A list of your customers will appear here
            </p>
          </td>
        </tr>
      )}
      enablePolling
      enableResizing={false}
      enableSorting={false}
      pollingInterval={1000}
      isLoading={loading}
      onRowClick={(row) => handleRowClick(row.original.id)}
      //   onRefresh={() => }
      loadingMessage="Loading Customers..."
      setPageCount={() => ""}
      setPageSize={() => ""}
      enablePagination
    />
  );
};

export default memo(CustomerTable);

// import { useState } from "react";
// // import { ServiceFeaturesCard } from "../../LoadingSkeleton";
// import { useNavigate } from "react-router";
// // import { useDispatch, useSelector } from "react-redux";
// // import { getCustomers } from "features/customer/customerSlice";
// import skeletonImage from "@/assets/svg/skeletonImage.svg";
// import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";

// export default function CustomerTable({ data, page, loading }) {
//   // console.log(page, "lado")
//   const dispatch = useAppDispatch();

//   const { customerPagination, error } = useAppSelector(
//     (state) => state.getCustomers
//   );
//   const getAgentApplication = useAppSelector(
//     (state) => state?.getApplicationByUserId
//   );
//   const newAgent = getAgentApplication?.agent || null;

//   const applicationId = newAgent.id;
//   const [currentPage, setCurrentPage] = useState(customerPagination?.currentPage);
//   const totalPages = customerPagination?.totalPages; // Total number of pages

//   const handlePageChange = (e) => {
//     setCurrentPage(Number(e.target.value));
//     dispatch(getCustomers({ applicationId, page: e.target.value, per_page: 20 }));
//   };

//   const TableRow = ({ email, name, id,phoneNumber, conversationDate }) => {
//     const [hoverText, setHoverText] = useState(false);
//     const navigate = useNavigate();

//     const handleClick = () => {
//       navigate(`/customers/${id}`);
//     };
//     function formatISODate(isoDate = conversationDate) {
//       // Create a new Date object from the ISO 8601 date string
//       let date = new Date(isoDate);

//       // Helper function to get the day with ordinal suffix
//       const getDayWithSuffix = (day) => {
//         if (day > 3 && day < 21) return day + "th"; // Special case for teens
//         switch (day % 10) {
//           case 1:
//             return day + "st";
//           case 2:
//             return day + "nd";
//           case 3:
//             return day + "rd";
//           default:
//             return day + "th";
//         }
//       };

//       // Array of abbreviated month names
//       const monthNames = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec",
//       ];

//       // Format the date components
//       let day = getDayWithSuffix(date.getUTCDate());
//       let month = monthNames[date.getUTCMonth()];
//       let year = date.getUTCFullYear().toString();

//       // Format the readable date string
//       return `${day} ${month}, ${year}`;
//     }
//     return (
//       <tr
//         className="cursor-pointer  border-b border-[#F7F7F7] border-solid"
//         onClick={handleClick}
//       >
//         {/* <td className="flex items-center pl-[20px] py-[20px] text-[#121212] font-normal text-sm w-[60%]">
//           <input
//             type="checkbox"
//             name=""
//             id=""
//             className="w-4 h-4 mr-[12px] border border-solid border-[#E9E9EA] rounded-sm"
//           />
//           {whatsAppIcon && (
//             <RiWhatsappFill className="text-[#60D669] mr-1 text-[16px]" />
//           )}
//           {customer}
//         </td> */}
//         <td className="text-[#121212] font-normal text-sm  py-[10px] pl-[20px]">
//           {name}
//         </td>
//         <td className="text-[#121212] font-normal text-sm">{email ?? "-"}</td>
//         <td className="text-[#121212] font-normal text-sm">
//           {phoneNumber ?? "-"}
//         </td>
//         <td className="text-[#121212] font-normal text-sm w-[15%]">
//           {formatISODate(conversationDate)}
//         </td>
//         <td className="text-[#121212] font-normal text-sm w-[15%]"></td>
//         {/* <td className=" w-[18%] -ml-4">
//           <Link
//             to="/ask-agent"
//             className={`text-sm font-normal font-figtree bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-pink-400 ${
//               hoverText
//                 ? "opacity-100 animate__animated animate__fadeIn animate__slow"
//                 : "opacity-0"
//             }`}
//           >
//             Ask assistant about customer
//           </Link>
//         </td> */}
//       </tr>
//     );
//   };

//   return (
//     <section className=" border border-[#F7F7F7] rounded-md mb-24 border-solid min-h-[70vh] relative">
//       <table className="mb-4 w-full font-figtree">
//         <tr>
//           <th className="rounded-tl-lg flex items-center bg-[#FAFAFA] py-[10px] pl-[20px] text-[#828282] font-semibold text-[14px]">
//             {/* <input
//               type="checkbox"
//               name=""
//               id=""
//               disabled
//               className="w-4 h-4 mr-[12px] border border-solid border-[#E9E9EA] rounded-sm"
//             /> */}
//             Customer
//           </th>
//           <th className="bg-[#FAFAFA] py-[10px] text-left text-[#828282] text-sm font-semibold">
//             Email Address
//           </th>
//           <th className="bg-[#FAFAFA] py-[10px] text-left text-[#828282] text-sm font-semibold">
//             Phone Number
//           </th>
//           <th className="bg-[#FAFAFA] py-[10px] text-left text-[#828282] text-sm font-semibold">
//             Last seen
//           </th>
//           <th className="bg-[#FAFAFA] py-[10px] text-left text-[#828282] text-sm font-semibold"></th>
//         </tr>
//         {data && data.length === 0 ? (
//           <tr>
//             <td colSpan={5} className="w-full pt-[128px]">
//               <div className="flex justify-center">
//                 <img src={skeletonImage} alt="template" className="w-[237px] h-[25px] mb-5" />
//               </div>

//               <p className="text-[rgba(130,130,130,1)] text-lg font-medium text-center">
//                 No Customers Yet
//               </p>
//               <p className=" text-center text-sm font-normal text-[#828282]">
//                 A list of your customers will appear here
//               </p>
//             </td>
//           </tr>
//         ) : (
//           data &&
//           data.map((data) => (
//             <TableRow
//               key={data.id}
//               name={data?.name}
//               email={data?.email}
//               phoneNumber={data?.phone_number}
//               status="Active"
//               conversationDate={data?.time_of_last_session}
//               id={data?.id}
//             />
//           ))
//         )}
//       </table>
//       {(loading  && !data.length)&& (
//         <div className=" flex justify-center w-full absolute top-[120px] ">
//           <ServiceFeaturesCard />
//           <ServiceFeaturesCard />
//         </div>
//       )}
//       {data?.length > 0 ? (
//         <div className="flex justify-end gap-[10px] items-center mr-2 pb-2 ">
//           <p className=" text-sm font-medium text-[#7F7F81] select-none">
//             Page
//           </p>
//           <select
//             className="cursor-pointer px-[12px] py-[5px] border border-solid border-[#DDD] bg-white rounded-lg outline-none text-sm font-medium text-[#7F7F81]"
//             name="page"
//             value={currentPage}
//             onChange={handlePageChange}
//           >
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <option key={page} value={page}>
//                 {page}
//               </option>
//             ))}
//           </select>
//           <p className=" text-sm font-medium text-[#7F7F81] select-none">{`of ${totalPages}`}</p>
//         </div>
//       ) : null}
//     </section>
//   );
// }
