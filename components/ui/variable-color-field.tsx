import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VariableColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function VariableColorField({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: VariableColorFieldProps) {
  // 空文字列や無効な値の場合はデフォルト色を使用
  const validColorValue =
    value && value.match(/^#[0-9A-Fa-f]{6}$/) ? value : "#000000";

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="w-full text-sm" htmlFor={id}>
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="color"
          value={validColorValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 border-2 p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-sm"
        />
      </div>
    </div>
  );
}
