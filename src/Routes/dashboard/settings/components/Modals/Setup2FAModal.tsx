import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { Modal } from "@/components/ui/modal/Modal";
import { useToast } from "@/contexts/ToastContext";
import { useModal } from "@/contexts/ModalContext";
import { MODAL_IDS } from "@/constants/modalIds";
import { Form } from "@/components/ui/form/Form";
import { z } from "zod";
import Qr from "@/assets/svg/qr_code_a.svg";
import { QRCodeSVG } from "qrcode.react";
import Wano from "@/assets/wano logo 1 1.png";
import { withFormField } from "@/components/ui/form/withFormField";
import OTPInput from "@/components/ui/form/OTPInput";
import { setupMFA } from "@/redux-slice/mfa/mfa.slice";
import { Button } from "@/components/ui/button/button";

// Define form schema
const OTPSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// Define form fields
const OTPFields = [
  {
    name: "code",
    label: "Enter OTP Code from your Authenticator app",
    className: "bg-transparent",
    type: "custom" as const,
    length: 6,
    autoFocus: true,
  },
];

const OTPInputWithFormField = withFormField(OTPInput);

interface Setup2FA {
  updateFAState: React.Dispatch<boolean>;
}

const Setup2FAModal: React.FC<Setup2FA> = ({ updateFAState }) => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { closeModal } = useModal();
  const { secret, qrCode } = useAppSelector((state) => state.mfa);
  const [step, setStep] = useState<"setup" | "verify">("setup");

  const handleVerifySubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      await dispatch(setupMFA(data.code)).unwrap();
      addToast("success", "2FA setup successful");
      closeModal(MODAL_IDS.SETUP_2FA);
    } catch (error: any) {
      addToast("error", error?.message || "Failed to verify code");
    }
  };

  const onClose = useCallback(() => {
    closeModal(MODAL_IDS.SETUP_2FA);
    updateFAState(false);
  }, [closeModal]);

  return (
    <Modal title="Setup Two-Factor Authentication" onClose={onClose}>
      <Modal.Header>
        <div className="flex flex-col justify-center items-center gap-2 mx-auto">
          <img src={Qr} alt="qr-code" className="w-[24px] h-[24px]" />
          <p className="text-[#101828] text-xl font-medium">Set up 2FA</p>
          <p className="text-[13px] text-[#828282] font-normal">
            Scan the QR Code below with your authenticator app.
          </p>
        </div>
      </Modal.Header>
      <Modal.Body>
        {step === "setup" ? (
          <div className="space-y-4">
            <p className="text-[10px] text-gray-600 hyphens-auto">
              1. Install an authenticator app like Google Authenticator or Authy
            </p>
            <p className="text-[10px] text-gray-600 hyphens-auto">
              2. Scan the QR code or enter the secret key manually:
            </p>
            {qrCode && (
              <div
                className="flex mx-auto h-[220px] justify-center py-[20px] mt-5 rounded-lg"
                style={{ background: "rgba(241, 241, 241, 0.39)" }}
              >
                <div className="w-fit bg-white p-[10px] rounded-lg">
                  <QRCodeSVG
                    value={secret as string}
                    size={160}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                    imageSettings={{
                      src: Wano,
                      x: undefined,
                      y: undefined,
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                </div>
              </div>
            )}
            <Form
              fields={OTPFields}
              schema={OTPSchema}
              onSubmit={handleVerifySubmit}
              submitLabel="Verify"
              className="p-0 border-none shadow-none"
              renderField={(field, form) => {
                if (field.type === "custom") {
                  return <OTPInputWithFormField field={field} form={form} />;
                }
                return <></>;
              }}
              renderButton={(form) => (
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="text-black"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button variant={"black"} size={"lg"}>{form.formState.isSubmitting ? "Setting Up..." : "Setup"}</Button>
                </div>
              )}
              hideSubmitButton
            />
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default Setup2FAModal;
