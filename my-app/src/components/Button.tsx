import React from "react";
import "../styles/components/button.scss";

type ButtonProps = {
  onButtonClick?: () => void;
  variant?: "primary" | "secondary" | "active_cat";
  children: JSX.Element | string;
  type?: "button" | "submit";
};

export const Button = ({ onButtonClick, children, type="button", variant="primary" }: ButtonProps) => {
  return (
    <button className={`button  ${variant}`} onClick={() => onButtonClick?.()}>
      {children}
    </button>
  );
};
