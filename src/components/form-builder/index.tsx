import { lazy, Suspense, JSX, useImperativeHandle, useMemo } from "react";
import type { CalendarProps } from "primereact/calendar";
import { Skeleton } from "primereact/skeleton";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import {
  FormFieldType,
  DependencyRule,
  VisibilityCondition,
  VisibilityConditionGroup,
  ComponentMap,
  FormBuilderProps,
} from "../../types/formBuilderType";
import zodRequiredFieldChecker from "./zodRequiredFieldChecker";
// import "./index.scss";

const Divider = lazy(() =>
  import("primereact/divider").then((m) => ({ default: m.Divider }))
);
const Button = lazy(() =>
  import("primereact/button").then((m) => ({ default: m.Button }))
);

/**
 * FormBuilderHandle extends UseFormReturn to expose all methods from react-hook-form
 * This provides access to all form state and methods without needing to expose them individually
 */
export type FormBuilderHandle<T extends FieldValues = any> =
  UseFormReturn<T> & {
    submitForm: () => void;
  };

const componentMap: ComponentMap = {
  InputText: lazy(() =>
    import("primereact/inputtext").then((m) => ({ default: m.InputText }))
  ),
  InputNumber: lazy(() =>
    import("primereact/inputnumber").then((m) => ({ default: m.InputNumber }))
  ),
  Dropdown: lazy(() =>
    import("primereact/dropdown").then((m) => ({ default: m.Dropdown }))
  ),
  Calendar: lazy(() =>
    import("primereact/calendar").then((m) => ({
      default: m.Calendar as React.ComponentType<CalendarProps<any, any>>,
    }))
  ),
  Checkbox: lazy(() =>
    import("primereact/checkbox").then((m) => ({ default: m.Checkbox }))
  ),
  InputMask: lazy(() =>
    import("primereact/inputmask").then((m) => ({ default: m.InputMask }))
  ),
  Password: lazy(() =>
    import("primereact/password").then((m) => ({ default: m.Password }))
  ),
  InputTextarea: lazy(() =>
    import("primereact/inputtextarea").then((m) => ({
      default: m.InputTextarea,
    }))
  ),
  RadioButton: lazy(() =>
    import("primereact/radiobutton").then((m) => ({ default: m.RadioButton }))
  ),
  MultiSelect: lazy(() =>
    import("primereact/multiselect").then((m) => ({ default: m.MultiSelect }))
  ),
  TriStateCheckbox: lazy(() =>
    import("primereact/tristatecheckbox").then((m) => ({
      default: m.TriStateCheckbox,
    }))
  ),
  ToggleButton: lazy(() =>
    import("primereact/togglebutton").then((m) => ({ default: m.ToggleButton }))
  ),
  Slider: lazy(() =>
    import("primereact/slider").then((m) => ({ default: m.Slider }))
  ),
  Rating: lazy(() =>
    import("primereact/rating").then((m) => ({ default: m.Rating }))
  ),
  ColorPicker: lazy(() =>
    import("primereact/colorpicker").then((m) => ({ default: m.ColorPicker }))
  ),
  PrimeFileUploader: lazy(() =>
    import("primereact/fileupload").then((m) => ({ default: m.FileUpload }))
  ),
  Chips: lazy(() =>
    import("primereact/chips").then((m) => ({ default: m.Chips }))
  ),
  Editor: lazy(() =>
    import("primereact/editor").then((m) => ({ default: m.Editor }))
  ),
  SelectButton: lazy(() =>
    import("primereact/selectbutton").then((m) => ({ default: m.SelectButton }))
  ),
  ListBox: lazy(() =>
    import("primereact/listbox").then((m) => ({ default: m.ListBox }))
  ),
  Knob: lazy(() =>
    import("primereact/knob").then((m) => ({ default: m.Knob }))
  ),
  InputSwitch: lazy(() =>
    import("primereact/inputswitch").then((m) => ({ default: m.InputSwitch }))
  ),
};

function isFieldInSchema(
  schema: z.ZodSchema<any>,
  field: FormFieldType
): boolean {
  if (["Button", "Divider"].includes(field.component)) {
    return true;
  }
  const pathParts = field.name?.toString()?.split(".");
  let currentSchema: z.ZodSchema<any> = schema;

  // Unwrap the schema to get to the underlying ZodObject
  // This handles .refine(), .superRefine(), .transform(), etc.
  while (currentSchema && typeof currentSchema._def === "object") {
    if (currentSchema instanceof z.ZodObject) {
      break; // We found the ZodObject, stop unwrapping
    } else if (currentSchema instanceof z.ZodOptional) {
      currentSchema = currentSchema._def.innerType;
    } else if (currentSchema instanceof z.ZodNullable) {
      currentSchema = currentSchema._def.innerType;
    } else if (currentSchema instanceof z.ZodDefault) {
      currentSchema = currentSchema._def.innerType;
    } else if (currentSchema instanceof z.ZodEffects) {
      // This handles .refine(), .superRefine(), .transform()
      currentSchema = currentSchema._def.schema;
    } else {
      break; // Can't unwrap further
    }
  }

  for (const part of pathParts) {
    while (currentSchema instanceof z.ZodOptional) {
      currentSchema = currentSchema._def.innerType;
    }

    if (currentSchema instanceof z.ZodObject) {
      const shape = currentSchema.shape;
      if (shape.hasOwnProperty(part)) {
        currentSchema = shape[part];
      } else {
        console.error(
          `Field with name:  '${field.name}' not found in schema. It will not be rendered.`
        );
        return false;
      }
    } else if (currentSchema instanceof z.ZodArray) {
      currentSchema = currentSchema.element;
    } else if (currentSchema instanceof z.ZodRecord) {
      currentSchema = currentSchema.valueSchema;
    } else {
      return false;
    }
  }

  return true;
}

export type { FormFieldType, FormBuilderProps };

export function FormBuilder<T extends FieldValues>({
  fields,
  schema,
  onSubmit,
  defaultValues,
  loadingFallback = <Skeleton className="mb-2" height="2rem" />,
  ref,
}: FormBuilderProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const filteredFields = useMemo(() => {
    return fields.filter((field) => isFieldInSchema(schema, field));
  }, [fields, schema]);

  // Expose all form methods via ref along with submitForm function
  useImperativeHandle(
    ref,
    () => ({
      ...methods,
      submitForm: () => {
        methods.handleSubmit(
          (data) => {
            // Only call onSubmit if validation passes
            onSubmit(data);
          },
          (errors) => {
            // Handle validation errors - don't call onSubmit
            console.log("Form validation failed:", errors);
          }
        )();
      },
    }),
    [methods, onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          (data) => {
            // Only call onSubmit if validation passes
            onSubmit(data);
          },
          (errors) => {
            // Handle validation errors - don't call onSubmit
            console.log("Form validation failed:", errors);
          }
        )}
        className={"form-builder grid grid-cols-12 gap-5"}
      >
        <PrimeReactFormBuilder
          fields={filteredFields}
          loadingFallback={loadingFallback}
          schema={schema}
        />
      </form>
    </FormProvider>
  );
}

const isConditionGroup = (
  condition: VisibilityCondition
): condition is VisibilityConditionGroup => {
  return "conditions" in condition && "logic" in condition;
};

const getFieldsFromCondition = (condition: VisibilityCondition): string[] => {
  if (isConditionGroup(condition)) {
    if (!condition.conditions) return [];
    return condition.conditions.flatMap(getFieldsFromCondition);
  }

  // At this point, condition must be VisibilitySingleCondition
  return condition.field ? [condition.field] : [];
};

const isFieldVisible = (
  fieldConfig: FormFieldType & { _visibleWhen?: VisibilityCondition },
  formValues: Record<string, any>
): boolean => {
  if (!fieldConfig._visibleWhen) return true;

  const checkCondition = (condition: VisibilityCondition): boolean => {
    if (isConditionGroup(condition)) {
      if (!condition.conditions) return false;

      const results = condition.conditions.map((c) => checkCondition(c));

      switch (condition.logic) {
        case "or":
          return results.some(Boolean);
        case "and":
        default:
          return results.every(Boolean);
      }
    }
    // Handle between condition
    if (condition.operator === "between") {
      if (
        !condition.field ||
        !Array.isArray(condition.value) ||
        condition.value.length !== 2
      )
        return false;
      const [min, max] = condition.value.map(Number);
      const current = Number(formValues[condition.field]);
      return !isNaN(current) && current >= min && current <= max;
    }

    // Handle other single conditions
    if (!condition.field) return false;
    const current = formValues[condition.field];
    const value = condition.value;
    const operator = (condition.operator || "equals").toLowerCase();

    switch (operator) {
      case "equals":
        return current === value;
      case "notequals":
        return current !== value;
      case "gt":
        return Number(current) > Number(value);
      case "gte":
        return Number(current) >= Number(value);
      case "lt":
        return Number(current) < Number(value);
      case "lte":
        return Number(current) <= Number(value);
      case "contains":
        return Array.isArray(current)
          ? current.includes(value)
          : String(current).includes(value);
      case "not-contains":
        return Array.isArray(current)
          ? !current.includes(value)
          : !String(current).includes(value);
      case "in":
        return Array.isArray(value) ? value.includes(current) : false;
      case "not-in":
        return Array.isArray(value) ? !value.includes(current) : false;
      case "regex": {
        try {
          return new RegExp(value).test(current);
        } catch {
          return false;
        }
      }
      default: {
        console.warn(`Unknown operator: ${operator}`);
        return current === value;
      }
    }
  };

  return checkCondition(fieldConfig._visibleWhen);
};

function getErrorFromPath<T>(obj: T, path: string): any {
  const keys = path.split(".");
  let result: any = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key as keyof typeof result];
    } else {
      return undefined;
    }
  }

  return result;
}
interface PrimeReactFormBuilderProps<T extends FieldValues> {
  fields: FormFieldType[];
  loadingFallback?: JSX.Element;
  schema: z.ZodSchema<T>;
}

function PrimeReactFormBuilder<T extends FieldValues>({
  fields,
  loadingFallback,
  schema,
}: PrimeReactFormBuilderProps<T>) {
  const formMethods = useFormContext<T>();
  const {
    control,
    formState: { errors },
    getValues,
    watch,
    setValue,
  } = formMethods;

  function removeFieldKeys(obj: any) {
    const newObj: any = {};
    for (let key in obj) {
      if (!key.startsWith("_")) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  const allValues = getValues();

  const renderFieldComponent = (
    field: FormFieldType,
    hookFormField: any,
    dynamicProps: any = {},
    isRequired?: boolean
  ): JSX.Element | null => {
    if (
      !field.component ||
      field.component === "Divider" ||
      field.component === "Button" ||
      !componentMap[field.component]
    )
      return null;
    const rhfField = removeFieldKeys(hookFormField);
    const formField = removeFieldKeys(field);

    switch (field.component) {
      case "Dropdown": {
        const Component = componentMap["Dropdown"];
        const customOnChange = formField.onChange;

        return (
          <Component
            {...formField}
            {...rhfField}
            onChange={(e) => {
              // Call react-hook-form's onChange first to update the form state
              rhfField.onChange(e);
              // Then call the custom onChange if it exists
              if (customOnChange) {
                customOnChange(e);
              }
            }}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
            filter
          />
        );
      }
      case "InputText": {
        const Component = componentMap["InputText"];
        const customOnChange = formField.onChange;

        return (
          <Component
            {...formField}
            {...rhfField}
            onChange={(e) => {
              // Call react-hook-form's onChange first to update the form state
              rhfField.onChange(e);
              // Then call the custom onChange if it exists
              if (customOnChange) {
                customOnChange(e);
              }
            }}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "InputNumber": {
        const Component = componentMap["InputNumber"];
        return (
          <Component
            {...formField}
            ref={rhfField.ref}
            value={rhfField.value}
            onValueChange={(e) => rhfField.onChange(e.value)}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Calendar": {
        const Component = componentMap["Calendar"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Checkbox": {
        const Component = componentMap["Checkbox"];
        return (
          <div className="d-flex align-items-center">
            <Suspense fallback={loadingFallback}>
              <Component
                {...formField}
                {...rhfField}
                checked={rhfField.value}
                {...(Object.entries(dynamicProps)?.length > 0
                  ? dynamicProps
                  : {})}
              />
            </Suspense>
            <label
              htmlFor={field.name.toString()}
              className="text-sm d-flex justify-start items-center gap-2"
              data-pr-tooltip={field._tooltip || ""}
            >
              {field._label}
              {isRequired ? (
                <Icon
                  icon={"mingcute:asterisk-line"}
                  height={16}
                  width={16}
                  className="text-red-600"
                ></Icon>
              ) : null}
              {field._tooltip ? (
                <span
                  id={field.name + "_tooltip"}
                  data-pr-tooltip={field._tooltip || ""}
                >
                  <Icon
                    icon="solar:info-circle-broken"
                    height={24}
                    width={24}
                  />
                </span>
              ) : null}
            </label>
          </div>
        );
      }
      case "InputMask": {
        const Component = componentMap["InputMask"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Password": {
        const Component = componentMap["Password"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "InputTextarea": {
        const Component = componentMap["InputTextarea"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "RadioButton": {
        const Component = componentMap["RadioButton"];
        return (
          <Component
            rhfField={rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "MultiSelect": {
        const Component = componentMap["MultiSelect"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "TriStateCheckbox": {
        const Component = componentMap["TriStateCheckbox"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "ToggleButton": {
        const Component = componentMap["ToggleButton"];
        return (
          <Component
            {...formField}
            {...rhfField}
            checked={rhfField.value}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Slider": {
        const Component = componentMap["Slider"];
        return (
          <Component
            {...formField}
            {...rhfField}
            value={rhfField.value}
            onChange={(e) => rhfField.onChange(e.value)}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Rating": {
        const Component = componentMap["Rating"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "ColorPicker": {
        const Component = componentMap["ColorPicker"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "PrimeFileUploader": {
        const Component = componentMap["PrimeFileUploader"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Chips": {
        const Component = componentMap["Chips"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Editor": {
        const Component = componentMap["Editor"];
        return (
          <Component
            style={{ minHeight: "100px" }}
            {...formField}
            value={rhfField.value}
            ref={rhfField.ref}
            onTextChange={(e) => rhfField.onChange(e.htmlValue)}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "SelectButton": {
        const Component = componentMap["SelectButton"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "ListBox": {
        const Component = componentMap["ListBox"];
        return (
          <Component
            {...formField}
            {...rhfField}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "Knob": {
        const Component = componentMap["Knob"];
        return (
          <Component
            {...formField}
            {...rhfField}
            value={rhfField.value || 0}
            onChange={(e) => rhfField.onChange(e.value)}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      case "InputSwitch": {
        const Component = componentMap["InputSwitch"];
        return (
          <Component
            {...formField}
            {...rhfField}
            checked={rhfField.value}
            {...(Object.entries(dynamicProps)?.length > 0 ? dynamicProps : {})}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      {fields.map((field) => {
        if (field.component === "Divider") {
          return (
            <Suspense fallback={loadingFallback}>
              <Divider key={field.name} className="col-12" {...field} />
            </Suspense>
          );
        } else if (field.component === "Button") {
          return (
            <Suspense fallback={loadingFallback}>
              <Button key={field.name} className="col-12" {...field} />
            </Suspense>
          );
        } else {
          let dynamicProps: any = {};
          if (field._dependsOn && field._dependsOn?.length > 0) {
            field._dependsOn.forEach((dependency: DependencyRule) => {
              const dependencyValue = watch(dependency.field as any);
              dynamicProps[dependency.propName] =
                dependency.dependencyHandler(dependencyValue);
            });
          }
          const isVisible =
            field._visibleWhen &&
            !["Button", "Divider"].includes(field.component)
              ? (() => {
                  const fieldsToWatch = getFieldsFromCondition(
                    field._visibleWhen
                  );
                  const values = Object.fromEntries(
                    fieldsToWatch.map((fieldName: string) => [
                      fieldName,
                      watch(fieldName as Path<T>),
                    ])
                  );
                  return isFieldVisible(field, values);
                })()
              : true;

          if (!isVisible) {
            setTimeout(() => {
              setValue(field.name as Path<T>, null as any, {
                shouldValidate: false,
                shouldDirty: false,
              });
            }, 0);
            return null;
          }

          const isRequired = zodRequiredFieldChecker(
            schema,
            field.name,
            allValues
          );

          const errorData = getErrorFromPath(errors, field.name);

          return (
            <div
              key={field.name.toString()}
              className={classNames(
                field._className ||
                  "xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12"
              )}
            >
              <Controller
                name={field.name as any}
                control={control}
                render={({ field: rhfField }) => {
                  return (
                    <div
                      className={classNames(
                        "d-flex",
                        field._labelGap ? `gap-${field._labelGap}` : "gap-2",
                        "flex-column"
                      )}
                    >
                      {field._tooltip ? (
                        <Tooltip target={`#${field.name}_tooltip`} />
                      ) : null}

                      {field._label && field.component !== "Checkbox" && (
                        <label
                          id={field.name}
                          htmlFor={field.name.toString()}
                          className="flex justify-start items-center gap-2 mb-3"
                        >
                          {field._label}
                          {isRequired ? (
                            <Icon
                              icon={"mingcute:asterisk-line"}
                              height={16}
                              width={16}
                              className="text-red-600"
                            ></Icon>
                          ) : null}
                          {field._tooltip ? (
                            <div
                              className="rounded-full h-4 cursor-pointer"
                              id={`${field.name}_tooltip`}
                              data-pr-tooltip={field._tooltip || "Afridid"}
                            >
                              <Icon
                                icon="solar:info-circle-broken"
                                height={16}
                                width={16}
                                strokeWidth={2}
                              />
                            </div>
                          ) : null}
                        </label>
                      )}
                      <Suspense fallback={loadingFallback}>
                        {renderFieldComponent(
                          field,
                          rhfField,
                          dynamicProps,
                          isRequired
                        )}
                      </Suspense>
                      {errorData ? (
                        <small className="p-error">
                          {errorData?.message as string}
                        </small>
                      ) : null}
                    </div>
                  );
                }}
              />
            </div>
          );
        }
      })}
    </>
  );
}
