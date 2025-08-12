import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VariableFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function VariableField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: VariableFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="w-full  " htmlFor={id}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
}
