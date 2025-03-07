import { JSX, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import "../../assets/FormStyle.scss";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

interface FormData {
  [key: string]: string | number | null | undefined;
}

interface DynamicFormProps {
  formFieldsArr: FormField[];
}

export interface CustomDynamicFormHandle {
  getFormValues: () => FormData;
  isFormValid: () => boolean;
  triggerValidation: () => Promise<boolean>;
  setFormValue: (name: string, value: string | number | null | undefined) => void;
  resetForm: (values?: FormData) => void;
}

const CustomDynamicForm = forwardRef<CustomDynamicFormHandle, DynamicFormProps>(
  ({ formFieldsArr }, ref) => {
    // Set default values for all fields
    const defaultValues = formFieldsArr.reduce((acc, field) => {
      if (field.type === "number") {
        acc[field.name] = null; // or 0, depending on your use case
      } else {
        acc[field.name] = ""; // Default to empty string for text/password fields
      }
      return acc;
    }, {} as FormData);

    // Create validation schema
    const validationSchema = Yup.object().shape(
      formFieldsArr.reduce((schema, field) => {
        if (field.validation) {
          schema[field.name] = field.validation;
        } else {
          schema[field.name] = Yup.mixed().notRequired();
        }
        return schema;
      }, {} as { [key: string]: Yup.AnySchema })
    );

    const {
      control,
      formState: { errors, isValid },
      getValues,
      setValue,
      trigger,
      reset,
    } = useForm<FormData>({
      resolver: yupResolver(validationSchema),
      mode: "all",
      defaultValues, // Set default values here
    });

    useImperativeHandle(ref, () => ({
      isFormValid: () => isValid,
      getFormValues: () => getValues(),
      setFormValue: (name: string, value: string | number | null | undefined) =>
        setValue(name, value),
      triggerValidation: () => trigger(),
      resetForm: (values?: FormData) => reset(values),
    }));

    const FeedbackHeader = (): JSX.Element => (
      <div className="font-bold mb-3">Pick a password</div>
    );

    const FeedbackFooter = (): JSX.Element => (
      <>
        <Divider />
        <p className="mt-2">Suggestions</p>
        <ul className="pl-2 ml-2 mt-0 line-height-3">
          <li>At least one lowercase</li>
          <li>At least one uppercase</li>
          <li>At least one numeric</li>
          <li>Minimum 8 characters</li>
        </ul>
      </>
    );

    return (
      <form className="custom_form">
        {formFieldsArr.map((field) => (
          <div key={field.name} className="custom_form_item">
            <label className="custom_form_label" htmlFor={field.name}>
              {field.label}
            </label>
            {field.type === "text" ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <InputText
                    id={field.name}
                    className={`form_input_text ${
                      errors[field.name] ? "p-invalid" : ""
                    }`}
                    {...controllerField}
                    placeholder={field.placeholder}
                    value={controllerField.value as string}
                  />
                )}
              />
            ) : field.type === "password" ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <Password
                    id={field.name}
                    className={`password_class ${
                      errors[field.name] ? "p-invalid" : ""
                    }`}
                    inputClassName="form_input_password"
                    {...controllerField}
                    placeholder={field?.placeholder}
                    value={controllerField.value as string}
                    feedback={field?.passwordmeter}
                    toggleMask={true}
                    header={field.passwordmeter ? FeedbackHeader : null}
                    footer={field.passwordmeter ? FeedbackFooter : null}
                  />
                )}
              />
            ) : field.type === "number" ? (
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <input
                    type="number"
                    id={field.name}
                    className={`form_input_number ${
                      errors[field.name] ? "p-invalid" : ""
                    }`}
                    {...controllerField}
                    placeholder={field.placeholder}
                    value={controllerField.value === null ? "" : controllerField.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      controllerField.onChange(value === "" ? null : Number(value));
                    }}
                  />
                )}
              />
            ) : (
              <>Not a Valid field-type</>
            )}
            {errors[field.name] && (
              <p className="error-class text-[10px] font-medium text-red-600 pt-1">
                {errors[field?.name]?.message}
              </p>
            )}
          </div>
        ))}
      </form>
    );
  }
);

export default CustomDynamicForm;