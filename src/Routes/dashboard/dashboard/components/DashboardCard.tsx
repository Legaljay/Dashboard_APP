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
    <div className="h-full rounded-xl relative overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-quick-access shadow-boxShadow dark:shadow-lg dark:bg-quick-access-dark dark:border dark:border-secondary-800">
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-[14px] leading-[19.6px] font-medium text-[#121212] dark:text-[#FFFFFF]">
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
