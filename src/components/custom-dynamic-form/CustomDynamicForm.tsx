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
  setFormValue: (
    name: string,
    value: string | number | null | undefined
  ) => void;
  resetForm: (values?: FormData) => void;
}

const CustomDynamicForm = forwardRef<CustomDynamicFormHandle, DynamicFormProps>(
  ({ formFieldsArr }, ref) => {
    // Set default values for all fields
    const defaultValues = formFieldsArr.reduce((acc, field) => {
      if (field.type === "number") {
        acc[field.name] = null;
      } else {
        acc[field.name] = "";
      }
      return acc;
    }, {} as FormData);

    formFieldsArr = formFieldsArr.map((field: FormField) => ({
      ...field,
      fieldclass: field.fieldclass ?? "w-full",
    }));

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
      mode: "onTouched",
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
      <form className="custom_form flex flex-wrap flex-row">
        {formFieldsArr.map((field) => (
          <div
            key={field.name}
            className={"iterator_class px-3 " + " " + field.fieldclass}
          >
            <div className={"custom_form_item"}>
              <label className="custom_form_label text-black mb-2" htmlFor={field.name}>
                {field.label}
                {field.validation &&
                  field.validation
                    .describe()
                    .tests.some((test) => test.name === "required") && (
                    <span className="text-red-600 text-xl leading-none"> *</span>
                  )}
              </label>
              {field.type === "text" ? (
                <Controller
                  name={field.name}
                  control={control}
                  render={({ field: controllerField }) => (
                    <InputText
                      id={field.name}
                      invalid = { errors[field.name] ? true : false}
                      className={`form_input_text`}
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
                      className={`password_class`}
                      invalid = { errors[field.name] ? true : false}
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
                      value={
                        controllerField.value === null
                          ? ""
                          : controllerField.value
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        controllerField.onChange(
                          value === "" ? null : Number(value)
                        );
                      }}
                    />
                  )}
                />
              ) : (
                <>Not a Valid field-type</>
              )}
              {errors[field.name] && (
                <p className="error-class text-[10px] font-medium text-red-600 pt-1 mt-1 mb-0">
                  {errors[field?.name]?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </form>
    );
  }
);

export default CustomDynamicForm;
