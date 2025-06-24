import React, { useState } from "react";
import "../styles/input_field.css";

export function InputField({ name, label, error, children }) {
  const [isFocused, setIsFocused] = useState(false);

  const errorColorClass = !isFocused && error ? "clr--terciary-300" : "";
  const errorBorderClass = !isFocused && error ? "error" : "";
  const spanLabel =
    !isFocused && error ? (
      <span className="label__error">
        <span className="px-1">-</span>
        {error}
      </span>
    ) : (
      <span className="ps-1 clr--terciary-300">*</span>
    );

  const enhancedChild =
    children && typeof children.type === "string"
      ? React.cloneElement(children, {
          id: name,
          className: `input__field w-100 py-2 px-3 rounded-2 bg--primary-700 ${errorBorderClass} ${
            children.props.className || ""
          }`,
          onFocus: (e) => {
            setIsFocused(true);
            if (children.props.onFocus) children.props.onFocus(e);
          },
          onBlur: (e) => {
            setIsFocused(false);
            if (children.props.onBlur) children.props.onBlur(e);
          },
        })
      : children;

  return (
    <div>
      <div className="label__field mb-2 fw--semibold">
        <label className={` ${errorColorClass}`} htmlFor={name}>
          <span className="text-uppercase">{label}</span>
          {spanLabel}
        </label>
      </div>
      <div>{enhancedChild}</div>
    </div>
  );
}
