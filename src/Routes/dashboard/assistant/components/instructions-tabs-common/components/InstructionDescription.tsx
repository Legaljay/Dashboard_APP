import React from 'react';

interface InstructionDescriptionProps {
  purpose?: 'sale' | 'customer' | 'general';
}

const InstructionDescription: React.FC<InstructionDescriptionProps> = ({ purpose }) => {
  const getDescription = () => {
    switch (purpose) {
      case 'sale':
        return 'Add and configure detailed instructions or guidelines on how your Assistant should close a sale with Customers.';
      case 'customer':
        return 'Add and configure detailed instruction or guidelines on how your Assistant should resolve Customer issues effectively.';
      case 'general':
        return 'Add and configure detailed instruction or guidelines on how your General AI should resolve Customer issues and/or complete sales effectively.';
      default:
        return '';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-medium">Instruction</h2>
      {purpose && (
        <p className="mt-[8px] text-xs font-normal text-[#7F7F81]">
          {getDescription()}
        </p>
      )}
    </div>
  );
};

export default InstructionDescription;
