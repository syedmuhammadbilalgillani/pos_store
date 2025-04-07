import React from "react";
import {
  Input,
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Switch
} from "@/components/ui/switch";
import TranslatedText from "./Language/TranslatedText";

type FormFieldOption = {
  label: string;
  value: string | number | boolean;
};

type FormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "password" | "select" | "checkbox";
  required?: boolean;
  options?: FormFieldOption[]; // for select
};

type FormInputProps = {
  field: FormField;
  value: any;
  onChange: (id: string, value: any) => void;
};

export const FormInput: React.FC<FormInputProps> = ({ field, value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = field.type === "checkbox" ? e.target.checked : e.target.value;
    onChange(field.id, val);
  };

  return (
    <div className="mb-4">
      <Label htmlFor={field.id} className="block mb-2 capitalize">
        <TranslatedText textKey={field.label}/>
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {["text", "email", "tel", "password"].includes(field.type) && (
        <Input
          id={field.id}
          type={field.type}
          value={value || ""}
          onChange={handleChange}
          required={field.required}
        />
      )}

      {field.type === "select" && field.options && (
        <Select
          onValueChange={(val) => onChange(field.id, val)}
          value={value?.toString() || ""}
          >
          <SelectTrigger id={field.id}>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem
                key={option.value.toString()}
                value={option.value.toString()}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "checkbox" && (
        <div className="flex items-center gap-3 mt-1">
          <Switch
            id={field.id}
            checked={!!value}
            onCheckedChange={(val) => onChange(field.id, val)}
          />
          <Label htmlFor={field.id}>Enabled</Label>
        </div>
      )}
    </div>
  );
};
