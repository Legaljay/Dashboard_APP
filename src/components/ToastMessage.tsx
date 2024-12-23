import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { MdCancel } from 'react-icons/md';
import { RiErrorWarningFill } from "react-icons/ri";
import { ToastType } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  forModal?: boolean;
  className?: string;
}

const toastConfig = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'bg-[#1774FD]',
    title: 'Success!',
    textColor: 'text-white',
  },
  error: {
    icon: MdCancel,
    bgColor: 'bg-[#F04248]',
    title: 'Error',
    textColor: 'text-white',
  },
  warning: {
    icon: RiErrorWarningFill,
    bgColor: 'bg-[#FFD21E]',
    title: 'Warning!',
    textColor: 'text-[#3D3D3F]',
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'bg-blue-500',
    title: 'Info',
    textColor: 'text-white',
  },
};

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  forModal = false,
  className = '',
}) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`${className} ${config.bgColor} py-3 px-4 rounded-lg flex items-center gap-3 font-figtree z-50 fixed shadow-xl cursor-pointer
        ${forModal ? "-top-7 -right-9" : "top-2 right-4"}
        transition-all duration-200 hover:scale-[1.02]`}
      onClick={onClose}
      role="alert"
      aria-live="assertive"
    >
      <Icon className={`${config.textColor} text-xl`} />
      <div>
        <p className={`font-semibold text-base ${config.textColor}`}>
          {config.title}
        </p>
        <p className={`${config.textColor} text-sm font-normal max-w-[256px]`}>
          {message}
        </p>
      </div>
    </motion.div>
  );
};