import React from 'react';
import Shape from "@/assets/svg/Shape65.svg";
import { LoadingScreenProps } from './types';

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, setupText }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-md">
      <div className="bg-[#E5E5E5] w-[64px] h-[64px] rounded-[11.14px] flex items-center justify-center">
        <img src={Shape} alt="shape" className="w-8 h-8" />
      </div>
      
      <h1 className="text-[32px] text-secondary font-semibold leading-[38.4px] text-center mt-4">
        Setting Up Business Name
      </h1>
      
      <div className="w-[287px] mt-[100px] mb-[50px]">
        <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm">{setupText}</p>
    </div>
  );
};

export default LoadingScreen;
