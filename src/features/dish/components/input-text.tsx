import { Input } from "@/components/ui/input";

interface InputTextProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export const InputText = ({
  value,
  onChangeText,
  placeholder,
  className,
}: InputTextProps) => {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      className={className}
      keyboardType="default"
    />
  );
};
