// components/Tour/TourOverlay.tsx
import icon from "@/assets/svg/Shape65.svg";
import arrow from "@/assets/svg/testArrow.svg";

interface TourOverlayProps {
    onTest: () => void;
    onClose: () => void;
  }
  
  export const TourOverlay: React.FC<TourOverlayProps> = ({ onTest, onClose }) => {
    return (
      <>
        <div className="bg-black bg-opacity-50 h-screen w-screen fixed top-0 left-0 z-30" />
        <div className="fixed z-40 bottom-40 right-[26px]">
          <div className="flex flex-col w-[337px] gap-3 bg-white py-[18px] px-[24px] rounded-xl">
            <div className="flex items-center gap-2">
              <img
                src={icon}
                alt="shape"
                className="w-[23.63px] h-[23.63px]"
              />
              <p className="text-[#7F7F81] text-[12px] leading-[18px]">
                You just uploaded your first document
              </p>
            </div>
            
            <p className="text-sm text-[#121212]">
              Test your assistant with the information you just uploaded. Or
              keep uploading more information.
            </p>
            
            <div className="flex justify-between text-[12px]">
              <button
                onClick={onClose}
                className="text-[#7F7F81] border border-[#7F7F81] leading-[14.4px] p-2 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Uploading
              </button>
              <button
                onClick={onTest}
                className="font-semibold text-white leading-[14.4px] p-2 bg-[#1774FD] rounded-lg hover:bg-[#1560d1] transition-colors"
              >
                Test Assistant
              </button>
            </div>
  
            <img
              src={arrow}
              alt="arrow"
              className="w-9 h-6 absolute -bottom-5 right-9"
            />
          </div>
        </div>
      </>
    );
  };