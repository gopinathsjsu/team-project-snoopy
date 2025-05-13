import React from "react";
import { InputProps } from "./types";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import { generateRandomString } from "@/utils/funcs";

const GetMenu = ({
  onHandleChange,
  title,
  name,
  value,
  viewOnly = false,
  disabled = false,
}: InputProps) => {
  const [currentValue, setCurrentValue] = React.useState({
    label: "",
    desc: "",
  });

  const keyDown = (e: any) => {
    e.persist();
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleDelete = (index: number) => {
    const values = [...value];
    values.splice(index, 1);
    onHandleChange?.(name, values);
  };

  const handleSubmit = () => {
    if (!currentValue.label || !currentValue.desc) {
      return;
    }

    const values = [
      ...value,
      { id: generateRandomString(10), value: currentValue },
    ];
    onHandleChange?.(name, values);
    setCurrentValue({ label: "", desc: "" });
  };
  return (
    <div style={{ position: "relative", marginTop: 20, width: "100%" }}>
      {!viewOnly && (
        <div>
          <div style={{ display: "flex", gap: "16px" }}>
            <InputBox
              name={name}
              value={currentValue.label}
              handleChange={(_name, value) => {
                setCurrentValue((prev: any) => {
                  return { ...prev, label: value };
                });
              }}
              label={`${title} Label`}
              disabled={disabled}
              type="search"
              customStyle={{ flex: 3 }}
              handleKeyDown={keyDown}
            />
            <InputBox
              name={name}
              value={currentValue.desc}
              handleChange={(_name, value) => {
                setCurrentValue((prev: any) => {
                  return { ...prev, desc: value };
                });
              }}
              label={`${title} Description`}
              disabled={disabled}
              type="search"
              customStyle={{ flex: 3 }}
              handleKeyDown={keyDown}
            />
            <ButtonBox
              type="button"
              label="Add"
              handleClick={handleSubmit}
              customBtnStyle={{ height: "50px" }}
              customStyle={{ marginTop: 0, marginBottom: 0 }}
            />
          </div>
        </div>
      )}
      {value?.length > 0 && (
        <div
          style={{
            border: "1px solid",
            padding: "10px",
            // boxShadow: "5px 10px 8px 10px #888888",
          }}
        >
          <h3>{title}</h3>
          <div>
            {value.map((item: any, index: number) => {
              return (
                <div key={item.id} style={{ marginBottom: "40px" }}>
                  <div>
                    <b>{item.value.label}</b>: {item.value.desc}
                  </div>
                  {!viewOnly && (
                    <div
                      className="text-center"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        marginBottom: "1.2em",
                      }}
                      aria-hidden="true"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      Delete
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(GetMenu);
