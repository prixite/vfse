import React, { useCallback, useRef, useState } from "react";

import { HexColorPicker, HexColorInput } from "react-colorful";

import useClickOutside from "@src/components/common/Presentational/ColorPicker/useClickOutside";

import "@src/components/common/Presentational/ColorPicker/ColorPicker.scss";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  title: string;
}
const ColorPicker = ({ color, onChange, title }: ColorPickerProps) => {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <>
      <h4>{title}</h4>
      <div className="picker">
        <div className="picker__content">
          <div
            className="swatch"
            style={{ backgroundColor: color }}
            onClick={() => toggle(true)}
          />
          <HexColorInput
            color={color}
            onChange={onChange}
            className="ColorInput"
          />
        </div>

        {isOpen && (
          <div className="popOverColorPicker" ref={popover}>
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        )}
      </div>
    </>
  );
};

export default ColorPicker;
