import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { RadioBoxType } from "@/components/types/RadioBox.types";

const RadioBox = ({
  options,
  title,
  name,
  handleChange,
  vals,
}: RadioBoxType) => {
  const [value, setValue] = React.useState("");

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    handleChange(name, (event.target as HTMLInputElement).value);
  };

  React.useEffect(() => {
    setValue(vals);
  }, [vals]);

  return (
    <div>
      <FormControl>
        <FormLabel id="demo-controlled-radio-buttons-group">{title}</FormLabel>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleToggle}
        >
          {options.map((item) => {
            return (
              <React.Fragment key={item.value}>
                <FormControlLabel
                  value={item.value}
                  control={<Radio />}
                  label={item.primary}
                />
                <FormHelperText>{item.secondary}</FormHelperText>
              </React.Fragment>
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>
  );
};
export default React.memo(RadioBox);
