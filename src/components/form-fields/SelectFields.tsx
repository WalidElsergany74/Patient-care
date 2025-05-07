import { ValidationErrors } from "@/validation";
import { IFormField } from "@/types";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Translations } from "@/types/Translations";
import React from "react";

interface Props extends IFormField {
  error: ValidationErrors;
  translations: Translations;
  options?: {
    label: string;
    value: string;
  }[];
}

const SelectField = ({
    label,
    name,
    error,
    defaultValue,
    placeholder,
    options = [],
  }: Props) => {
    const [value, setValue] = React.useState(defaultValue as string || "");
  
    return (
      <div className="mb-3">
        <Label htmlFor={name} className="capitalize">
          {label}
        </Label>
        <div className="mt-2">
          <Select value={value} onValueChange={(val) => setValue(val)} name={name}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        {error && error[name] && (
          <p className="text-destructive dark:text-red-700 mt-2 text-sm font-medium">
            {error[name]}
          </p>
        )}
      </div>
    );
  };
  

export default SelectField;
