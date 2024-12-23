import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard';
import Launch2 from '@/Assets/svg/launch1.svg';
import Puzzle2 from '@/Assets/svg/mentalpuzzle.svg';
import TestTime2 from '@/Assets/svg/testClock.svg';

const QuickAccess = memo(() => {
  const quickAccessLinks = [
    {
      to: "support",
      state: { Faqs: true },
      image: Launch2,
      title: "Need help getting started?",
      description: "Have questions about your account, assistant or billing? Click to find out more.",
      imgClassName: "mb-[-60px] mr-[-20px]"
    },
    {
      to: "assistant",
      state: { state: "Memory" },
      image: Puzzle2,
      title: "Train your customer care assistant",
      description: "Upload support documents to your assistant's memory so it can learn all the basics about your business.",
      imgClassName: "mb-[-50px]"
    },
    {
      to: "assistant",
      state: { state: "Features" },
      image: TestTime2,
      title: "Personalise your customer care assistant",
      description: "Add instructions or guidelines on how your Assistant should resolve inquiries, requests and complaints with Customers.",
      imgClassName: "mb-[-70px] mr-[-20px]"
    }
  ];

  return (
    <div className="mt-[80px]">
      <h1 className="mb-[32px] !text-xl font-medium !text-BLACK-_600 leading-[21.6px]">
        Quick Access
      </h1>
      <div className="mt-[20px] flex gap-[24px]">
        {quickAccessLinks.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            state={link.state}
            className="w-[33.3%] h-[224px]" //forrmerly h-[254px]
          >
            <DashboardCard
              imageSrc={link.image}
              title={link.title}
              description={link.description}
              imgClassName={link.imgClassName}
            />
          </Link>
        ))}
      </div>
    </div>
  );
});

QuickAccess.displayName = 'QuickAccess';

export default QuickAccess;
