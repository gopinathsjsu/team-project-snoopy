import { OptionsType } from "./CheckBox.types";

export type RadioBoxType = {
  options: OptionsType[];
  title: string;
  name: string;
  handleChange: (n: string, v: string) => void;
  disabled?: boolean;
  vals: string;
};
