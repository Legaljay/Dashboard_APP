import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useAppDispatch, useAppSelector } from "@/redux-slice/hooks";
import { generateMFASecret, getMFASettings, setupMFA, toggleMFA, verifyMFA } from "@/redux-slice/mfa/mfa.slice";
import { Switch } from "@headlessui/react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import Setup2FAModal from "./Modals/Setup2FAModal";

const TwoFA: React.FC = () => {
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const [openFAModal, setOpenFAModal] = useState<boolean>(false)
  const { isEnabled, isSetup } = useAppSelector((state) => state.mfa);

  const checkTwoFAstatus = async() => {
    if (!isEnabled && !isSetup) {
      //corrected this logic
      await dispatch(generateMFASecret());
      setOpenFAModal(true);
      openModal(MODAL_IDS.SETUP_2FA, <Setup2FAModal updateFAState={setOpenFAModal}/>, { preventScroll: true });
    } else if (isSetup) {
      await dispatch(toggleMFA());
    }
  };


  return (
    <div className="flex gap-8 w-full pt-7 items-center">
      <div className="flex flex-col w-[350px]">
        <p className="text-sm text-BLACK-_100 dark:text-WHITE-_100 font-medium">
          2FA Authentication (Multi Factor)
        </p>
        <p className="text-sm text-[#7F7F81]">
          Set up another layer of authentication for extra protection of your
          account.
        </p>
      </div>
      <div className="w-[520px] px-[50px]">
        <Switch checked={openFAModal} onChange={checkTwoFAstatus} as={Fragment}>
          {({ checked }) => (
            /* Use the `checked` state to conditionally style the button. */
            <button
              className={`${
                checked
                  ? "bg-blue-600"
                  : isEnabled && isSetup
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                  className={`${
                  checked ? '-translate-x-4' : isEnabled && isSetup ?  '-translate-x-4' : 'translate-x-1'
                  } absolute inline-block h-4 w-4 transform rounded-full bg-white transition dark:bg-background-dark`}
              />
            </button>
          )}
        </Switch>
      </div>
    </div>
  );
};

export default TwoFA;
