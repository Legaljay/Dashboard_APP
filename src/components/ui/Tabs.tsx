
type TabsProps = {
  tabs: string[] | any[];
  logo?: boolean;
  color?: string;
  activeTab: number;
  loading?: boolean;
  fullWidth?: boolean;
  setActiveTab: (index: number) => void;
  isImportant?: number[];
};


export default function Tabs({ logo, tabs, color, activeTab, fullWidth, loading, setActiveTab, isImportant }: TabsProps) {
  const selectTab = (index: number) => {
    setActiveTab(index);
  }

  return (
    <>
      {logo ?
        <div className="">
          <div className={`flex justify-between text-xs font-medium text-center rounded-lg transition-transform transform outline-none`}>
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => selectTab(index)}
                role='button'
                className={`max-w-[250px] w-[230px] flex justify-center items-center gap-3 cursor-pointer py-2 px-6 rounded-[15px] text-primary-dark-blue transition-all body-medium ${ activeTab == index && color}`}
                >
                  <div className="flex gap-[2px]">
                    {/* TODO: add logo if provided */}
                    <p className='whitespace-nowrap'>{tab.name}</p>
                    {tab.isImportant && (<span className="text-RED-_100">*</span>)}
                  </div>
              </div>
            ))}
          </div>
          {/* loader */}
        </div>
        :
        <div className="flex justify-between text-xs font-medium text-center rounded-lg transition-transform transform outline-none">
          <div className={`flex border border-neutral-200 bg-[#FAFAFA] space-x-2 rounded-lg ${fullWidth ? 'w-full' : 'w-full lg:w-max lg:overflow-visible'} overflow-x-auto overflow-y-hidden`}>
            {tabs.map((tab, index) => (
              <div
                key={index}
                onClick={() => selectTab(index)}
                role='button'
                className={`cursor-pointer py-2 px-6 rounded-lg text-primary-dark-blue transition-all body-medium ${activeTab == index ? " text-[#1774FD] bg-white shadow": "text-[#7F7F81]"}`}>
                  <div className="flex gap-[2px]">
                    <p className='whitespace-nowrap'>{tab}</p>
                    {isImportant?.[index] && (<span className="text-RED-_100">*</span>)}
                  </div>
              </div>
            ))}
          </div>
          {/* loader */}
        </div>
      }
    </>
  )
}