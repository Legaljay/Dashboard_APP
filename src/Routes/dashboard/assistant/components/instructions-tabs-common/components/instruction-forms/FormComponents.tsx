import { Delete } from "@/assets/svg";
import { forwardRef, Ref } from "react";

export interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const TextInput: React.FC<TextInputProps> = forwardRef(({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}, ref: Ref<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
        {label}
        {required && <span className="text-red-700 pl-[2px]">*</span>}
      </label>
      <input
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-[#101828] text-xs py-[10px] px-[14px] rounded-lg border ${
          error ? "border-[#AF202D]" : "border-[#D0D5DD] dark:border-stone-600"
        } bg-white dark:bg-gray-800 focus:outline-none w-full`}
      />
      {error && <span className="text-[#AF202D] text-xs">{error}</span>}
    </div>
  );
});

export interface TextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  customLabel?: React.ReactNode;
}

const TextArea: React.FC<TextAreaProps> = forwardRef(({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  customLabel,
}, ref: Ref<HTMLTextAreaElement>) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-figtree text-[#101828] dark:text-gray-300 flex items-center">
        {customLabel ? (
          customLabel
        ) : (
          <>
            {label}
            {required && <span className="text-red-700 pl-[2px]">*</span>}
          </>
        )}
      </label>
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-[#101828]  dark:text-gray-300 text-xs py-[10px] px-[14px] rounded-lg border ${
          error ? "border-[#AF202D]" : "border-[#D0D5DD] dark:border-stone-600"
        } bg-white dark:bg-gray-800 focus:outline-none w-full`}
        rows={10}
      />
      {error && <span className="text-[#AF202D] text-xs">{error}</span>}
    </div>
  );
});

export interface SupportChannelProps {
  channel: 
  {
    support_channel: string;
    website: string;
  };
  index: number;
  onRemove: (index: number) => void;
  onChange: (name: string, value: string) => void;
  error?: string;
}

const SupportChannel: React.FC<SupportChannelProps> = ({
  channel,
  index,
  onRemove,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="w-full flex justify-between items-center">
        <label className="text-xs font-figtree text-[#101828] dark:text-gray-300">{channel.support_channel}</label>
        <div className="cursor-pointer" onClick={() => onRemove(index)}>
          <Delete />
        </div>
      </div>
      <input
        type="text"
        value={channel.website}
        onChange={(e) => onChange(channel.support_channel, e.target.value)}
        className={`border bg-transparent dark:bg-gray-800 rounded-lg py-[8px] px-[14px] text-sm ${
          error ? "border-[#AF202D]" : "border-[#D0D5DD] dark:border-stone-600"
        }`}
        placeholder={`Enter ${channel.support_channel} details`}
      />
      {error && <p className="text-[#AF202D] text-xs">{error}</p>}
    </div>
  );
};


SupportChannel.displayName = 'SupportChannel';
TextInput.displayName = 'TextInput';
TextArea.displayName = 'TextArea';

export { TextInput, TextArea, SupportChannel };
