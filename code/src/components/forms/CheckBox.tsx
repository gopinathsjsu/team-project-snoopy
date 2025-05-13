import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { ChecBoxType } from "@/components/types/CheckBox.types";

const CheckBox = ({
  options,
  title,
  name,
  handleChange,
  disabled,
  vals,
}: ChecBoxType) => {
  const [checked, setChecked] = React.useState<Array<string>>([]);

  const handleToggle = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log("newChecked: ", newChecked);
    handleChange(name, newChecked);
    setChecked(newChecked);
  };

  React.useEffect(() => {
    setChecked(vals);
  }, [vals]);

  return (
    <div>
      <Typography variant="button" gutterBottom sx={{ display: "block" }}>
        {title}
      </Typography>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {options.map((item, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                role={undefined}
                onClick={() => {
                  console.log("newChecked: ", item);
                  if (disabled) {
                    return;
                  }
                  console.log("newChecked1: ", item.value);
                  handleToggle(item.value);
                  console.log("newChecked2: ", item.value);
                }}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.includes(item.value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    disabled={disabled}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={item.primary}
                  secondary={item.secondary}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};
export default React.memo(CheckBox);
