import React from "react";
import styles from "./forms.module.css";

const Text = ({
  handleChange,
  name,
  value,
  placeholder,
  label,
  type,
}: {
  handleChange: (n: string, v: string) => void;
  name: string;
  value: string;
  placeholder: string;
  label: string;
  type: string;
}) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputTitle}>{label}</div>
      <input
        type={type}
        className={styles.input}
        name="username"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleChange(name, e.target.value);
        }}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Text;
