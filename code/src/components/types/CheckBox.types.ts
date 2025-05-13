export type OptionsType = {
  primary: string;
  value: string;
  secondary?: string;
};

export type ChecBoxType = {
  options: OptionsType[];
  title: string;
  name: string;
  handleChange: (n: string, v: string[]) => void;
  disabled?: boolean;
  vals: string[];
};
