import React, { useCallback, useMemo } from "react";
import { Warning } from "@/assets/svg";
import { useNavigate } from "react-router";

interface Feature {
  feature: string;
  id: string;
}

interface CustomFeaturesProps {
  handleClose: () => void;
  data: Feature[];
}

const Button: React.FC<{
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, className = "", children }) => (
  <button
    onClick={onClick}
    className={`outline-none py-3 w-full px-5 rounded-lg text-[14px] font-bold ${className}`}
    type="button"
  >
    {children}
  </button>
);

const FeaturesList: React.FC<{ features: Feature[] }> = ({ features }) => {
  if (features.length === 0) {
    return <p className="text-center">No Features</p>;
  }

  return (
    <div className="flex flex-col gap-[25px]">
      {features.map((feature) => (
        <p 
          key={feature.id} 
          className="text-[14px] font-medium text-[#828282]"
        >
          {feature.feature}
        </p>
      ))}
    </div>
  );
};

const CustomFeatures: React.FC<CustomFeaturesProps> = ({ handleClose, data }) => {
  const navigate = useNavigate();

  // Memoize features data to prevent unnecessary re-renders
  const features = useMemo(() => data, [data]);

  // Store features in localStorage
  React.useEffect(() => {
    localStorage.setItem("agent_features", JSON.stringify(features));
  }, [features]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleCreateInstructions = useCallback(() => {
    navigate("/agent/create-feature");
  }, [navigate]);

  const renderHeader = () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5 items-center w-full">
        <Warning />
        <h2 className="text-[24px] text-[#101828] font-medium">
          Features Identified
        </h2>
      </div>
      {features.length > 0 && (
        <p className="text-[14px] font-medium text-[#828282] text-center">
          We found {features.length} feature(s) from the document uploaded.
          <br />
          Create instructions on how you want your Assistant to complete
          sales for them.
        </p>
      )}
    </div>
  );

  const renderFeatures = () => (
    <div className="flex flex-col gap-[19px]">
      {features.length > 0 && (
        <p className="text-[14px] font-medium text-[#121212]">Features</p>
      )}
      <FeaturesList features={features} />
    </div>
  );

  const renderActions = () => {
    if (features.length === 0) {
      return (
        <div className="flex flex-col gap-3 items-center">
          <Button 
            onClick={handleClose}
            className="bg-[#121212] text-white"
          >
            Close
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 items-center">
        <Button 
          onClick={handleCreateInstructions}
          className="bg-[#121212] text-white"
        >
          Create Instructions
        </Button>
        <button
          onClick={handleClose}
          className="text-[14px] font-bold text-[#868686] cursor-pointer hover:text-[#6e6e6e] transition-colors"
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  };

  return (
    <div className="py-[30px] px-[50px] flex flex-col gap-6 bg-white rounded-[8px] h-fit w-[582px] mt-10">
      <div className="flex flex-col gap-10">
        {renderHeader()}
        {renderFeatures()}
      </div>
      {renderActions()}
    </div>
  );
};

export default React.memo(CustomFeatures);
