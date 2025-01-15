import React from "react";

const Archives: React.FC = () => {
  return (
    <section className="flex flex-col gap-[33px]">
      <div className="flex justify-between w-full items-center">
        <div>
          <h2 className="text-[24px] font-medium text-[#121212] dark:text-WHITE-_400">Archives</h2>
          <p className="text-[#7F7F81] text-[12px] leading-[18px]">
            You can find all expired scheduled Instructions here
          </p>
        </div>
      </div>
      {/* <InstructionTable
        handleActivation={publishInstruction}
        deleteInstruction={deleteInstruction}
        refresh={fetchData}
        publishLoading={publishLoading}
        name={type}
        id={id}
        fetchedData={fetchedData}
        loading={loading}
      /> */}
    </section>
  );
};

export default Archives;
