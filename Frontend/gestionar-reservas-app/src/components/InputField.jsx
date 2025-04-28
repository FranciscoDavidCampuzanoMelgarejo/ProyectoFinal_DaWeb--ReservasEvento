import { useState } from "react";
import '../styles/input_field.css';

export function InputField({ name, label, type, value, onChange, error }) {
  const [isFocused, setIsFocused] = useState(false);

  const errorColorClass = (!isFocused && error) ? "clr--terciary-300" : "";
  const errorBorderClass = (!isFocused && error) ? "error" : "";
  const spanLabel = (!isFocused && error) ? (
    <span className="label__error">
      <span className="px-1">-</span>
      {error}
    </span>
  ) : (
    <span className="ps-1 clr--terciary-300">*</span>
  );
  
  return (
    <div>
      <div className="label__field mb-2 fw--semibold">
        <label className={` ${errorColorClass}`} htmlFor={name}>
          <span className="text-uppercase">{label}</span>
          {spanLabel}
        </label>
      </div>
      <div>
        <input
          className={`input__field ${errorBorderClass} w-100 py-2 px-3 rounded-2 bg--primary-700`}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
        />
      </div>
    </div>
  );
}
