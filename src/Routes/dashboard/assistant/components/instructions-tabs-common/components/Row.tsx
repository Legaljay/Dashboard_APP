import React from "react";

interface RowProps {
  item: {
    name: string;
    category: string;
    support_channel: string[];
  };
  onSelect: (item: any) => void;
}

const Row: React.FC<RowProps> = React.memo(({ item, onSelect }) => {
  const categoryStyles: Record<string, string> = {
    Behaviour: "bg-[#EFF5FF] text-[#1774FD]",
    Complaints: "bg-[#FFF2F6] text-[#FF407B]",
    Requests: "bg-[#F7FDF8] text-[#009733]",
    ScheduledInstructions: "bg-orange-100 text-orange-500",
    Enquiries: "bg-[#F6FDF8] text-[#009733]",
  };

  return (
    <tr
      className="border-t cursor-pointer hover:bg-[#F4F8FF]/70"
      onClick={() => onSelect(item)}
    >
      <td className="px-4 py-4 text-[#121212] font-normal text-sm">
        {item.name}
      </td>
      <td className="px-4 py-2">
        <span
          className={`py-1 px-2 font-normal rounded-lg text-sm capitalize ${
            categoryStyles[item.category.replace(/\s+/g, "")]
          }`}
        >
          {item.category === "ScheduledInstructions"
            ? "ScheduledInstructions"
            : item.category}
        </span>
      </td>
      <td className="px-4 py-2 text-[#828282] font-normal text-sm">
        {item.support_channel.join(", ")}
      </td>
    </tr>
  );
});

export default Row;