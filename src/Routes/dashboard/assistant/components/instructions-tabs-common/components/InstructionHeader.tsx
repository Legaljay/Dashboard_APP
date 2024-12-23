import React from 'react';
import shareIcon from "@/assets/svg/sharee.svg";
import banner from "@/assets/svg/banner.svg";

interface InstructionHeaderProps {
  onViewTemplates: () => void;
}

const InstructionHeader: React.FC<InstructionHeaderProps> = ({ onViewTemplates }) => {
  return (
    <header
      className="pl-[24px] relative shadow-box pr-[51px] w-full py-[47px] rounded-xl mb-8 flex justify-between items-center"
      style={{
        backgroundImage: "linear-gradient(to bottom right, #FDF6F9 10%, #F6F6FC 50%, #FAFCFF 100%)",
      }}
    >
      <div className="flex flex-col">
        <p className="font-bold text-[32px] text-bamboo">
          Need Help? Use templates!
        </p>
        <p className="text-sm font-normal text-BLACK-_300 leading-6">
          Don't know how to get started with instructions? Use our already made templates as your guide.
        </p>
        <div>
          <button
            className="text-WHITE-_100 cursor-pointer rounded-lg bg-BLACK-_500 flex gap-2 w-fit mt-6 text-[10px] font-semibold py-2 px-2.5"
            onClick={onViewTemplates}
          >
            View Templates
            <img src={shareIcon} alt="requests" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <img
        src={banner}
        alt="requests"
        className="absolute right-0 bottom-0 w-[65%]"
      />
    </header>
  );
};

export default InstructionHeader;
