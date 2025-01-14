import React from "react";
import { useNavigate } from "react-router-dom";
import Success from "@/assets/svg/partycap.svg";
import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/Modal";

interface RedeemSuccessProps {
  handleClose: () => void;
  title: string;
  text1?: string;
  text2?: string;
  label: string;
  redirectPath: string;
}

const RedeemSuccess: React.FC<RedeemSuccessProps> = ({
  handleClose,
  title,
  text1,
  text2,
  label,
  redirectPath,
}) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    handleClose();
    navigate(redirectPath);
  };

  return (
    <Modal title={title} onClose={handleClose}>
      <section className="flex justify-center items-center">
        <div>
          <div className="px-[81px] py-[53px] flex flex-col gap-[32px]">
            <div className="flex justify-center">
              <img
                src={Success}
                alt="redeem success"
                className="w-[129.5px] h-[131.8px] rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-[15px]">
              <h1 className="font-medium text-[20px] leading-[21.5px] text-[#101828] dark:text-WHITE-_100 text-center">
                {title}
              </h1>
              <p className="text-[14px] leading-[21px] text-[#828282] text-center">
                {text1 && <span>{text1}</span>}
                {text2 && <span className="font-semibold">{text2}</span>}
              </p>
            </div>
            <Button
              variant="secondary"
              className="bg-[#1774FD] text-center flex justify-center items-center rounded-lg h-[36px] p-2"
              onClick={handleRedirect}
            >
              <p className="text-center font-semibold text-sm text-WHITE-_100">
                {label}
              </p>
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default React.memo(RedeemSuccess);
