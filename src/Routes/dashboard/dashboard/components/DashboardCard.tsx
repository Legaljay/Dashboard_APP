import { memo } from 'react';

interface DashboardCardProps {
  imageSrc: string;
  title: string;
  description: string;
  imgClassName?: string;
}

const DashboardCard = memo(({
  imageSrc,
  title,
  description,
  imgClassName = ""
}: DashboardCardProps) => {
  return (
    <div className="h-full rounded-xl relative overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-quick-access"
      style={{ boxShadow: "0px 4px 8px 1px rgba(215, 215, 215, 0.25)" }}>
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-[14px] leading-[19.6px] font-medium text-[#121212]">
            {title}
          </h3>
          <p className="text-[12px] leading-[18px] text-[#7F7F81] mt-[23px]">
            {description}
          </p>
        </div>
        <div className={`flex justify-end ${imgClassName}`}>
          <img src={imageSrc} alt={title} className="w-[150px] h-[150px] object-contain" />
        </div>
      </div>
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
