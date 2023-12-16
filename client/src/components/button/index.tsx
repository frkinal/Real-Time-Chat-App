import React from "react";
interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  isRequired?: boolean;
  type: "button" | "submit" | "reset";
}
export const Button: React.FC<ButtonProps> = ({
  label = "Button",
  className = "",
  type = "button",
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${className}`}
      {...rest}
    >
      {label}
    </button>
  );
};
