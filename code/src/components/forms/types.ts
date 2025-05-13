export type InputProps = {
  onHandleChange?: (name: string, value: any) => void;
  placeholder?: string;
  title: string;
  name: string;
  value: any;
  viewOnly?: boolean;
  disabled?: boolean;
};

export type FileUploadProps = {
  handleChange?: (name: string, value: any) => void;
  prevFiles: any;
  title: string;
  user?: any;
  isProfilePic?: boolean;
  viewOnly?: boolean;
  isMultiple?: boolean;
  hideSubmitButton?: boolean;
};
