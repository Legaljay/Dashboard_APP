import React, { useCallback } from "react";
import backArrow from "@/assets/svg/backArrow.svg";
import Row from "./Row";
import { Instruction } from "../../sections/Instructions";

interface TableComponentProps {
  data: Instruction[];
  setViewTemplate: (view: 'table' | 'form' | false) => void;
  setSelectedTemplate: (template: any) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  setViewTemplate,
  setSelectedTemplate,
}) => {
  const handleSelect = useCallback(
    (item: Instruction) => {
      setSelectedTemplate(item);
      setViewTemplate("form");
    },
    [setSelectedTemplate, setViewTemplate]
  );

  return (
    <div className="mt-[35px] border border-[#EEEFF0] rounded-[6px]">
      <table className="min-w-full">
        <thead className="bg-[#FAFAFAAD] text-[#828282] text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Instruction Name</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Support Channels</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <Row key={index} item={item} onSelect={handleSelect} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InstructionTemplateTable: React.FC<TableComponentProps> = ({
  data,
  setViewTemplate,
  setSelectedTemplate,
}) => {
  return (
    <div>
      <nav className="flex gap-1 items-center mb-4 ">
        <div
          className="flex gap-1 cursor-pointer"
          onClick={() => setViewTemplate(false)}
        >
          <img src={backArrow} alt="Images" />

          <p className="text-[#121212] text-sm font-normal ">Templates</p>
        </div>
      </nav>
      <h2 className=" text-2xl font-medium">Templates</h2>
      <TableComponent
        data={data}
        setViewTemplate={setViewTemplate}
        setSelectedTemplate={setSelectedTemplate}
      />
    </div>
  );
};

export { InstructionTemplateTable };
