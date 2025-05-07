
import { Label } from "../ui/label";
import { Checkbox as ShadcnCheckbox } from "../ui/checkbox";
import { IFormField } from "@/types";

interface Props {
  onClick?: () => void;
  checked: boolean;
  label?: IFormField["label"];
  name: IFormField["name"];
}

const Checkbox = ({ label, name, checked, onClick }: Props) => {
  return (
    <div className="text-accent flex items-center gap-2">
      <ShadcnCheckbox
        type="button"
        id={name}
        name={name}
        onClick={onClick}
        checked={checked}
      />
      <Label htmlFor={name} className="text-sm font-normal text-stone-900">
        {label}
      </Label>
    </div>
  );
};

export default Checkbox;