import React from "react";
interface InputProps extends React.HTMLProps<HTMLInputElement> {
  isRequired?: boolean;
  inputClassName?: string;
}
export const Input: React.FC<InputProps> = ({
  label = "",
  name = "",
  className = "",
  inputClassName = "",
  ...rest
}) => {
  return (
    <div className={`w-1/2 ${className}`}>
      <label
        htmlFor="first_name"
        className="block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>
      <input
        id={name}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5 ${inputClassName}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
