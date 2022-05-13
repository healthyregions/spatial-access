import {FormControl, InputLabel, Select, MenuItem} from "@mui/material";

interface InputForDetailProps{
  items: Array<string>;
  value: string | undefined;
  title: string;
  onChange: (update: string) => void;
}


export const InputForDetail: React.FC<InputForDetailProps> = ({ items, title, onChange, value }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={`${title}_label`}>{title}</InputLabel>
      <Select
        labelId={`${title}_label`}
        id={title}
        value={value}
        label={title}
        onChange={(e) => onChange(e.target.value!)}
      >
        {items.map((item) => (
          <MenuItem key={item} value={item}>{item}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

