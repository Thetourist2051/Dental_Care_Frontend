import { JSX, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import "../../assets/FormStyle.scss";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

interface FormData {
  [key: string]: string | number | null;
}

interface DynamicFormProps {
  formFieldsArr: FormField[];
}

export interface CustomDynamicFormHandle {
  getFormValues: () => FormData;
  isFormValid: () => boolean;
  triggerValidation: () => Promise<boolean>;
  setFormValue: (name: string, value: string) => void;
  resetForm: (values?: FormData) => void;
}

const CustomDynamicForm = forwardRef<CustomDynamicFormHandle, DynamicFormProps>(
  ({ formFieldsArr }, ref) => {
    const defaultValues = formFieldsArr.reduce((acc, field) => {
      if (field.type === "number") {
        acc[field.name] = null;
      } else {
        acc[field.name] = null;
      }
      return acc;
    }, {} as FormData);

    const validationSchema = Yup.object().shape(
      formFieldsArr.reduce((schema, field) => {
        schema[field.name] = field.validation;
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
      defaultValues: defaultValues,
    });

    useImperativeHandle(ref, () => ({
      isFormValid: () => isValid,
      getFormValues: () => getValues(),
      setFormValue: (name: string, value: string) => setValue(name, value),
      triggerValidation: () => trigger(),
      resetForm: (values?: FormData) => reset(values),
    }));

    const FeedbackHeader = (): JSX.Element => (
      <div className="font-bold mb-3">Pick a password</div>
    )
    
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
    )

    return (
      <form className="custom_form">
        {formFieldsArr.map((field) => (
          <div key={field.name} className="custom_form_item">
            <label className="custom_form_label" htmlFor={field.name}>
              {field.label}
            </label>
            {field.type === "text" ? (
              <>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={defaultValues[field.name]}
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
              </>
            ) : field.type === "password" ? (
              <>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={defaultValues[field.name]}
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
              </>
            ) : field.type === "number" ? (
              <>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue={defaultValues[field.name]}
                  render={({ field: controllerField }) => (
                    <InputNumber
                      id={field.name}
                      className={`password_class ${
                        errors[field.name] ? "p-invalid" : ""
                      }`}
                      inputClassName="form_input_password"
                      {...controllerField}
                      placeholder={field?.placeholder}
                      value={controllerField.value as number}
                    />
                  )}
                />
              </>
            ) : (
              <>Not a Valid field-type</>
            )}
            {errors[field.name] && (
              <p className="error-class text-xs font-medium text-red-600 pt-1">
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
