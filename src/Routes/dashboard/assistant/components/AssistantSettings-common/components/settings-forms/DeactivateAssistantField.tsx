import { MODAL_IDS } from "@/constants/modalIds";
import { useModal } from "@/contexts/ModalContext";
import { useAppSelector } from "@/redux-slice/hooks";
import { Switch } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import DeactivateAssistantModal from "../../modals/DeactivateAssistantModal";
import { useParams } from "react-router-dom";

const DeactivateAssistantField: React.FC = () => {
  const { openModal } = useModal();
  const { assistantId = "" } = useParams();
  const selected = useAppSelector((state) =>
    state.applications.applications.find(
      (app) => app.id === assistantId
    //state.applications.selectedApplication
    )
  );
  const is_active = selected?.deactivated;

  const checkDeactivateAssistantFieldstatus = async () => {
    if (!is_active) {
      openModal(
        MODAL_IDS.custom("deactivate-assistant-modal"),
        <DeactivateAssistantModal
          assistantId={assistantId}
          isActive={false}
        />,
        { preventScroll: true }
      );
    } else {
      openModal(
        MODAL_IDS.custom("deactivate-assistant-modal"),
        <DeactivateAssistantModal
          assistantId={assistantId}
          isActive={true}
        />,
        { preventScroll: true }
      );
    }
  };

  return (
    <div className="flex gap-8 w-full mt-[50px] items-center">
      <div className="flex flex-col w-2/6">
        <p className="text-sm font-medium text-BLACK-_100 dark:text-WHITE-_100">
          Deactivate Assistant
        </p>
        <p className="text-sm text-[#7F7F81]">
          Set your assistant as inactive. This prevents your customers from
          interacting with the Assistant
        </p>
      </div>
      <div className="w-1/2 px-[50px]">
        <Switch
          checked={is_active}
          onChange={checkDeactivateAssistantFieldstatus}
          as={Fragment}
        >
          {({ checked }) => (
            /* Use the `checked` state to conditionally style the button. */
            <button
              className={`${
                checked
                  ? "bg-blue-600"
                  : is_active
                  ? "bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-800 dark:border-secondary-800 dark:border"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  checked
                    ? "translate-x-1"
                    : is_active
                    ? "translate-x-1"
                    : "-translate-x-4"
                } absolute inline-block h-4 w-4 transform rounded-full bg-white dark:bg-background-dark transition`}
              />
            </button>
          )}
        </Switch>
      </div>
    </div>
  );
};

export default DeactivateAssistantField;
