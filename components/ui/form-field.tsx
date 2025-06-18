import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Label className="w-32" htmlFor={id}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  );
}
