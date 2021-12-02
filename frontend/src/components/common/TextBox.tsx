import React from "react";
import "@src/components/common/TextBox.scss";

interface textboxProps {
  placeholder: string;
  className: string;
}
const TextBox = ({ placeholder, className }: textboxProps) => {
  return <input type="text" placeholder={placeholder} className={className} />;
};

export default TextBox;
