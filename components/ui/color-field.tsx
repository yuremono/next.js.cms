import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ColorField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: ColorFieldProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Label className="" htmlFor={id}>
        {label}
      </Label>
      <div className="flex flex-1 gap-2">
        <Input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 border-2 p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1  "
        />
      </div>
    </div>
  );
}
