import React from 'react';
import { AddBtnService } from "@/assets/svg";
import ServicesBlocks from './ServiceBlocks';
import { SmallCard } from '@/components/ui/skeleton/LoadingSkeleton';
import { AppCategory } from '@/redux-slice/app-categories/app-categories.slice';

interface InstructionGridProps {
  loading: boolean;
  applicationId: string;
  data: AppCategory[];
  onAddInstruction: () => void;
  onFetchUpdate: () => void;
}

const InstructionGrid: React.FC<InstructionGridProps> = ({
  loading,
  applicationId,
  data,
  onAddInstruction,
  onFetchUpdate,
}) => {
  return (
    <div className="grid grid-cols-3 gap-6 mt-6">
      {loading ? (
        <SmallCard />
      ) : (
        data?.map((item) => (
          <ServicesBlocks
            key={item.id}
            data={item}
            applicationId={applicationId}
            handleFetchUpdate={onFetchUpdate}
          />
        ))
      )}

      <div
        className="cursor-pointer h-[158px] bg-white dark:bg-stone-950 dark:border-stone-800 dark:text-stone-50 border border-[#E5E5E5] p-4 rounded-xl"
        onClick={onAddInstruction}
      >
        <div className="mb-5">
          <AddBtnService />
        </div>
        <p className="text-[#121212] dark:text-stone-50 text-base font-medium">
          Add Instruction Category
        </p>
        <p className="text-xs font-normal text-[#7F7F81] mt-2">
          Create a new category for your instructions.
        </p>
      </div>
    </div>
  );
};

export default InstructionGrid;
