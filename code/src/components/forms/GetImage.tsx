import React from "react";
import { InputProps } from "./types";
import InputBox from "@/components/forms/InputBox";
import ButtonBox from "@/components/forms/ButtonBox";
import Image from "next/image";
import { generateRandomString } from "@/utils/funcs";

const GetImage = ({
  onHandleChange,
  title,
  name,
  value,
  viewOnly = false,
  disabled = false,
}: InputProps) => {
  const [currentValue, setCurrentValue] = React.useState("");

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
    if (!currentValue) {
      return;
    }

    const values = [
      ...value,
      { id: generateRandomString(10), value: currentValue },
    ];
    onHandleChange?.(name, values);
    setCurrentValue("");
  };
  return (
    <div style={{ position: "relative", marginTop: 20 }}>
      {!viewOnly && (
        <div>
          <div style={{ display: "flex", gap: "16px" }}>
            <InputBox
              name={name}
              value={currentValue}
              handleChange={(_name, value) => {
                setCurrentValue(value);
              }}
              label={title}
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
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "400px",
                    }}
                  >
                    <a href={item.value} target="_blank" rel="noreferrer">
                      <Image
                        src={item.value}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "contain" }}
                      />
                    </a>
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

export default React.memo(GetImage);
