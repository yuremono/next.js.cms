import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HtmlInput } from "@/components/ui/html-input";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  allowHtml?: boolean;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  allowHtml = false,
}: FormFieldProps) {
  const InputComponent = allowHtml ? HtmlInput : Input;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Label className="w-32" htmlFor={id}>
        {label}
      </Label>
      <InputComponent
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
