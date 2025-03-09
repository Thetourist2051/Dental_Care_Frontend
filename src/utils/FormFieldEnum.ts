import * as Yup from "yup";

export interface FormField {
  field_key?: string;
  name: string;
  type:
    | "text"
    | "password"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "radio";
  label: string;
  placeholder?: string;
  validation?: Yup.AnySchema;
  fieldwidth?: string;
  passwordmeter?: boolean;
  fieldclass?: string;
  options?: {label: string, value:any}[]
}
