import { CircleAlert, EyeClosed } from "lucide-react";
import type { ChangeEvent } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  placeholder,
  type = "text",
}) => (
  <div className="flex flex-col gap-2 mb-8">
    <label className="font-semibold text-[16px] leading-[120%]" htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`px-6 py-4 bg-[rgba(255,254,240,1)] w-156 box-border rounded-2xl border font-normal text-[16px] text-[rgba(147,164,151,1)] focus:text-[rgb(0,0,0)] ${error ? "border-[rgba(255,33,37,1)] focus:border-[rgba(255,33,37,1)]" : "border"}`}
      />
      {(error && (
        <>
          <p className="text-[12px] text-[rgba(255,33,37,1)] leading-[120%] mt-1.25">
            {error}
          </p>
          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
            <CircleAlert color="rgba(255,33,37,1)" size={18} />
          </div>
        </>
      )) ||
        (type === "password" && (
          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
            <EyeClosed size={24} className="cursor-pointer" />
          </div>
        ))}
    </div>
  </div>
);

export default FormField;
