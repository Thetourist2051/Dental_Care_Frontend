import { JSX, forwardRef, useImperativeHandle } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import "../../assets/FormStyle.scss";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputTextarea } from "primereact/inputtextarea";
import { InputMask } from "primereact/inputmask";
import { Tooltip } from "primereact/tooltip";

interface FormData {
  [key: string]: string | number | Date | null | undefined | any;
}

interface DynamicFormProps {
  formFieldsArr: FormField[];
  viewForm?: boolean;
}

export interface CustomDynamicFormHandle {
  getFormValues: () => FormData;
  isFormValid: () => boolean;
  triggerValidation: () => Promise<boolean>;
  setFormValue: (
    name: string,
    value: string | number | Date | null | undefined | any
  ) => void;
  resetForm: (values?: FormData) => void;
}

const CustomDynamicForm = forwardRef<CustomDynamicFormHandle, DynamicFormProps>(
  ({ formFieldsArr, viewForm = false }, ref) => {
    const defaultValues = formFieldsArr.reduce((acc, field) => {
      if (field.type === "number") {
        acc[field.name] = null;
      } else if (field.type === "date") {
        acc[field.name] = null;
      } else if (field.type === "multiselect") {
        acc[field.name] = [];
      } else {
        acc[field.name] = "";
      }
      return acc;
    }, {} as FormData);

    formFieldsArr = formFieldsArr.map((field: FormField) => ({
      fieldclass: field.fieldclass ?? "w-full",
      addonIcon: field.addonIcon ?? null,
      addonIconPosition: field.addonIconPosition ?? "left",
      addonPieIcon: field.addonPieIcon ?? true,
      disabledField: viewForm ? true : field?.disabledField ?? false,
      ...field,
      options: field.options || [],
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
      mode: "all",
      defaultValues,
    });

    useImperativeHandle(ref, () => ({
      isFormValid: () => isValid,
      getFormValues: () => getValues(),
      setFormValue: (
        name: string,
        value: string | number | Date | null | undefined | any[]
      ) => setValue(name, value),
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
      <>
        <Tooltip target=".custom_form_label .info_class" />
        <form className="custom_form flex flex-wrap flex-row">
          {formFieldsArr.map((field: FormField) => (
            <div
              key={field.name}
              className={
                "iterator_class px-1 md:px-2 xl:px-3 " + " " + field.fieldclass
              }
            >
              <div
                className={`custom_form_item ${
                  field.addonIcon
                    ? field.addonIconPosition === "left"
                      ? "border_adjust_left"
                      : field.addonIconPosition === "right"
                      ? "border_adjust_right"
                      : ""
                    : "no_border_adjust"
                }`}
              >
                <label
                  className="custom_form_label text-black mb-2"
                  htmlFor={field.name}
                >
                  {field.label}
                  {field.validation &&
                    field.validation
                      .describe()
                      .tests.some((test) => test.name === "required") && (
                      <span className="text-red-600 text-xl leading-none">
                        {" "}
                        *
                      </span>
                    )}
                  {field.info && (
                    <div
                      className="inline-block info_class pl-2 leading-none cursor-pointer"
                      data-pr-tooltip={field.info}
                    >
                      <i className="pi pi-info-circle font-light text-[0.75rem]"></i>
                    </div>
                  )}
                </label>
                {field.type === "text" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <>
                        <div className="p-inputgroup flex-1">
                          {field.addonIcon &&
                            field.addonIconPosition === "left" && (
                              <span className="p-inputgroup-addon">
                                {field.addonPieIcon ? (
                                  <i className={`pi pi-${field.addonIcon}`}></i>
                                ) : (
                                  <span className="text-sm font-semibold">
                                    {field.addonIcon}
                                  </span>
                                )}
                              </span>
                            )}

                          <InputText
                            id={field.name}
                            invalid={!!errors[field.name]}
                            className="form_input_text"
                            {...controllerField}
                            placeholder={field.placeholder}
                            value={controllerField.value as string}
                            disabled={field?.disabledField}
                          />

                          {field.addonIcon &&
                            field.addonIconPosition === "right" && (
                              <span className="p-inputgroup-addon">
                                {field.addonPieIcon ? (
                                  <i className={`pi pi-${field.addonIcon}`}></i>
                                ) : (
                                  <span className="text-sm font-semibold">
                                    {field.addonIcon}
                                  </span>
                                )}
                              </span>
                            )}
                        </div>
                      </>
                    )}
                  />
                ) : field.type === "password" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <>
                        <>
                          <div className="p-inputgroup flex-1">
                            {field.addonIcon &&
                              field.addonIconPosition === "left" && (
                                <span className="p-inputgroup-addon">
                                  {field.addonPieIcon ? (
                                    <i
                                      className={`pi pi-${field.addonIcon}`}
                                    ></i>
                                  ) : (
                                    <span className="text-sm font-semibold">
                                      {field.addonIcon}
                                    </span>
                                  )}
                                </span>
                              )}

                            <Password
                              id={field.name}
                              className={`password_class`}
                              invalid={errors[field.name] ? true : false}
                              inputClassName="form_input_password"
                              {...controllerField}
                              placeholder={field?.placeholder}
                              value={controllerField.value as string}
                              feedback={field?.passwordmeter}
                              toggleMask={true}
                              header={
                                field.passwordmeter ? FeedbackHeader : null
                              }
                              footer={
                                field.passwordmeter ? FeedbackFooter : null
                              }
                              disabled={field?.disabledField}
                            />

                            {field.addonIcon &&
                              field.addonIconPosition === "right" && (
                                <span className="p-inputgroup-addon">
                                  {field.addonPieIcon ? (
                                    <i
                                      className={`pi pi-${field.addonIcon}`}
                                    ></i>
                                  ) : (
                                    <span className="text-sm font-semibold">
                                      {field.addonIcon}
                                    </span>
                                  )}
                                </span>
                              )}
                          </div>
                        </>
                      </>
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
                        disabled={field?.disabledField}
                        className={`form_input_number ${
                          errors[field.name] ? "p-invalid" : ""
                        } ${
                          field?.disabledField
                            ? "disabled-field"
                            : "active-field"
                        }`}
                        {...controllerField}
                        placeholder={field.placeholder}
                        value={
                          controllerField.value === null ||
                          controllerField.value === undefined
                            ? ""
                            : controllerField.value.toString()
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
                ) : field.type === "date" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => {
                      const value = controllerField.value
                        ? new Date(controllerField.value)
                        : null;

                      return (
                        <Calendar
                          id={field.name}
                          invalid={errors[field.name] ? true : false}
                          className={`form_input_calender`}
                          {...controllerField}
                          placeholder={field.placeholder}
                          value={value}
                          onChange={(e) => {
                            const selectedDate = e.value as Date | null;
                            controllerField.onChange(
                              selectedDate?.toISOString() || null
                            );
                          }}
                          showIcon={true}
                          disabled={field?.disabledField}
                        />
                      );
                    }}
                  />
                ) : field.type === "radio" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <>
                        {field.options?.map((option) => (
                          <div
                            key={option.value}
                            className="flex align-items-center content-start mb-2 last:mb-0"
                          >
                            <RadioButton
                              inputId={option.value}
                              name={controllerField.name}
                              value={option.value}
                              disabled={field?.disabledField}
                              onChange={(e) =>
                                controllerField.onChange(e.value)
                              }
                              checked={controllerField.value === option.value}
                            />
                            <label
                              htmlFor={option.value}
                              className="ml-2 font-medium text-sm"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                  />
                ) : field.type === "select" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <Dropdown
                        invalid={errors[field.name] ? true : false}
                        id={field.name}
                        value={controllerField.value}
                        onChange={(e) => controllerField.onChange(e.value)}
                        options={field.options}
                        optionLabel="label"
                        placeholder={field.placeholder || "Select an option"}
                        className="w-full"
                        showClear={true}
                        showFilterClear={true}
                        filter={true}
                        disabled={field?.disabledField}
                      />
                    )}
                  />
                ) : field.type === "multiselect" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <MultiSelect
                        id={field.name}
                        value={controllerField.value}
                        invalid={errors[field.name] ? true : false}
                        onChange={(e) => controllerField.onChange(e.value)}
                        options={field.options}
                        optionLabel="label"
                        placeholder={field.placeholder || "Select options"}
                        maxSelectedLabels={3}
                        className="w-full"
                        showClear={true}
                        filter={true}
                        disabled={field?.disabledField}
                      />
                    )}
                  />
                ) : field.type === "textarea" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <InputTextarea
                        id={field.name}
                        value={controllerField.value as string}
                        onChange={(e) =>
                          controllerField.onChange(e.target.value)
                        }
                        rows={field.rowcount || 3}
                        autoResize={true}
                        cols={field.colcount}
                        invalid={errors[field.name] ? true : false}
                        placeholder={field.placeholder}
                        className={`form_input_textarea w-full`}
                        disabled={field?.disabledField}
                      />
                    )}
                  />
                ) : field.type === "inputmask" ? (
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: controllerField }) => (
                      <InputMask
                        id={field.name}
                        value={controllerField.value as string}
                        onChange={(e) =>
                          controllerField.onChange(e.target.value)
                        }
                        mask={field?.mask || ""}
                        placeholder={field.mask}
                        invalid={errors[field.name] ? true : false}
                        className={`form_input_text`}
                        disabled={field?.disabledField}
                      />
                    )}
                  />
                ) : (
                  <>Not a Valid field-type</>
                )}
                {errors[field.name] && (
                  <p className="error-class text-[10px] font-medium text-red-600 pt-1 mt-1 mb-0">
                    {errors[field.name]?.message?.toString() ??
                      "Validation error"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </form>
      </>
    );
  }
);

export default CustomDynamicForm;
