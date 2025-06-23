import { JSX, LazyExoticComponent } from 'react';
import { ButtonProps } from 'primereact/button';
import { CalendarProps } from 'primereact/calendar';
import { CheckboxProps } from 'primereact/checkbox';
import { ChipsProps } from 'primereact/chips';
import { ColorPickerProps } from 'primereact/colorpicker';
import { DividerProps } from 'primereact/divider';
import { DropdownProps } from 'primereact/dropdown';
import { EditorProps } from 'primereact/editor';
import { FileUploadProps } from 'primereact/fileupload';
import { InputMaskProps } from 'primereact/inputmask';
import { InputNumberProps } from 'primereact/inputnumber';
import { InputSwitchProps } from 'primereact/inputswitch';
import { InputTextProps } from 'primereact/inputtext';
import { InputTextareaProps } from 'primereact/inputtextarea';
import { KnobProps } from 'primereact/knob';
import { ListBoxProps } from 'primereact/listbox';
import { MultiSelectProps } from 'primereact/multiselect';
import { PasswordProps } from 'primereact/password';
import { RatingProps } from 'primereact/rating';
import { SelectButtonProps } from 'primereact/selectbutton';
import { SliderProps } from 'primereact/slider';
import { ToggleButtonProps } from 'primereact/togglebutton';
import { TriStateCheckboxProps } from 'primereact/tristatecheckbox';
import { DefaultValues, FieldValues } from 'react-hook-form';
import { ZodSchema } from 'zod';
import { FormBuilderHandle } from '../../src/components/form-builder';
import { RadioButtonProps } from 'primereact/radiobutton';

// Custom FileUploader props for form integration (only visual props)


export type ComponentMap = {
  InputText: LazyExoticComponent<React.ComponentType<InputTextProps>>;
  InputNumber: LazyExoticComponent<React.ComponentType<InputNumberProps>>;
  Dropdown: LazyExoticComponent<React.ComponentType<DropdownProps>>;
  Calendar: LazyExoticComponent<React.ComponentType<CalendarProps<any, any>>>; // Generic Calendar component that accepts any selection mode and value type
  Checkbox: LazyExoticComponent<React.ComponentType<CheckboxProps>>;
  InputMask: LazyExoticComponent<React.ComponentType<InputMaskProps>>;
  Password: LazyExoticComponent<React.ComponentType<PasswordProps>>;
  InputTextarea: LazyExoticComponent<React.ComponentType<InputTextareaProps>>;
  RadioButton: LazyExoticComponent<React.ComponentType<any>>;
  MultiSelect: LazyExoticComponent<React.ComponentType<MultiSelectProps>>;
  TriStateCheckbox: LazyExoticComponent<React.ComponentType<TriStateCheckboxProps>>;
  ToggleButton: LazyExoticComponent<React.ComponentType<ToggleButtonProps>>;
  Slider: LazyExoticComponent<React.ComponentType<SliderProps>>;
  Rating: LazyExoticComponent<React.ComponentType<RatingProps>>;
  ColorPicker: LazyExoticComponent<React.ComponentType<ColorPickerProps>>;
  PrimeFileUploader: LazyExoticComponent<React.ComponentType<FileUploadProps>>;
  Chips: LazyExoticComponent<React.ComponentType<ChipsProps>>;
  Editor: LazyExoticComponent<React.ComponentType<EditorProps>>;
  SelectButton: LazyExoticComponent<React.ComponentType<SelectButtonProps>>;
  ListBox: LazyExoticComponent<React.ComponentType<ListBoxProps>>;
  Knob: LazyExoticComponent<React.ComponentType<KnobProps>>;
  InputSwitch: LazyExoticComponent<React.ComponentType<InputSwitchProps>>;
};

export interface FormBuilderProps<T extends FieldValues> {
  fields: FormFieldType[];
  schema: ZodSchema<T>;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  loadingFallback?: JSX.Element;
  ref: React.Ref<FormBuilderHandle>;
}

export type ComponentProps =
  | InputTextProps
  | InputNumberProps
  | DropdownProps
  | CalendarProps<any, any> // Generic Calendar props that can handle any selection mode and value type
  | CheckboxProps
  | InputMaskProps
  | PasswordProps
  | InputTextareaProps
  | MultiSelectProps
  | TriStateCheckboxProps
  | ToggleButtonProps
  | SliderProps
  | RatingProps
  | ColorPickerProps
  | FileUploadProps
  | ChipsProps
  | EditorProps
  | SelectButtonProps
  | ListBoxProps
  | KnobProps
  | InputSwitchProps

type KeysOfUnion<T> = T extends any ? keyof T : never;

export type ReactPrimeFieldPropNames = KeysOfUnion<ComponentProps>;

export interface VisibilityConditionGroup {
  logic: 'and' | 'or';
  conditions: VisibilityCondition[];
}

export interface VisibilitySingleCondition {
  field: string;
  value: any;
  operator:
    | 'equals'
    | 'notequals'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'contains'
    | 'not-contains'
    | 'in'
    | 'not-in'
    | 'regex'
    | 'between';
}

export type VisibilityCondition = VisibilitySingleCondition | VisibilityConditionGroup;

export type DependencyRule = {
  field: string;
  propName: ReactPrimeFieldPropNames;
  dependencyHandler: (fieldValue: any) => any;
};

export type BaseField = {
  name: string;
  _required?: boolean;
  _tooltip?: string;
  _className?: string;
  _label?: string | JSX.Element;
  _visibleWhen?: VisibilityCondition;
  _labelOrientation?: 'horizontal' | 'vertical';
  _labelGap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  _dependsOn?: DependencyRule[];
};

type DividerField = Omit<
  BaseField,
  '_className' | '_label' | '_visibleWhen' | '_dependsOn' | '_required' | '_tooltip' | '_labelOrientation'
> & {
  component: 'Divider';
} & Omit<DividerProps, 'name'>;

type ButtonField = Omit<
  BaseField,
  '_className' | '_label' | '_visibleWhen' | '_dependsOn' | '_required' | '_tooltip' | '_labelOrientation'
> & {
  component: 'Button';
} & Omit<ButtonProps, 'name'>;

type InputField = BaseField & {
  component: 'InputText';
} & Omit<InputTextProps, 'name'>;

type InputNumberField = BaseField & {
  component: 'InputNumber';
} & Omit<InputNumberProps, 'name'>;

type SliderField = BaseField & {
  component: 'Slider';
} & Omit<SliderProps, 'name'>;

type DropdownField = BaseField & {
  component: 'Dropdown';
} & Omit<DropdownProps, 'name'>;

type CalendarField = BaseField & {
  component: 'Calendar';
  selectionMode: 'single' | 'multiple' | 'range';
} & Omit<CalendarProps<any, any>, 'name' | 'selectionMode'>;

type CheckboxField = BaseField & {
  component: 'Checkbox';
} & Omit<CheckboxProps, 'name' | 'checked'>;

type RadioButtonField = BaseField & {
  component: 'RadioButton';
} & Omit<RadioButtonProps, 'rhfField'>;

type MaskField = BaseField & {
  component: 'InputMask';
} & Omit<InputMaskProps, 'name'>;

type TextareaField = BaseField & {
  component: 'InputTextarea';
} & Omit<InputTextareaProps, 'name'>;

type MultiSelectField = BaseField & {
  component: 'MultiSelect';
} & Omit<MultiSelectProps, 'name'>;

type PasswordField = BaseField & {
  component: 'Password';
} & Omit<PasswordProps, 'name'>;

type SelectButtonField = BaseField & {
  component: 'SelectButton';
} & Omit<SelectButtonProps, 'name'>;

type TriStateCheckboxField = BaseField & {
  component: 'TriStateCheckbox';
} & Omit<TriStateCheckboxProps, 'name'>;

type ToggleButtonField = BaseField & {
  component: 'ToggleButton';
} & Omit<ToggleButtonProps, 'name'>;

type RatingField = BaseField & {
  component: 'Rating';
} & Omit<RatingProps, 'name'>;

type ColorPickerField = BaseField & {
  component: 'ColorPicker';
} & Omit<ColorPickerProps, 'name'>;

type PrimeFileUploaderField = BaseField & {
  component: 'PrimeFileUploader';
} & Omit<FileUploadProps, 'name'>;

type ChipsField = BaseField & {
  component: 'Chips';
} & Omit<ChipsProps, 'name'>;

type EditorField = BaseField & {
  component: 'Editor';
} & Omit<EditorProps, 'name'>;

type ListBoxField = BaseField & {
  component: 'ListBox';
} & Omit<ListBoxProps, 'name'>;

type KnobField = BaseField & {
  component: 'Knob';
} & Omit<KnobProps, 'name'>;

type InputSwitchField = BaseField & {
  component: 'InputSwitch';
} & Omit<InputSwitchProps, 'name'>;


export type FormFieldType =
  | InputField
  | InputNumberField
  | DropdownField
  | CalendarField
  | CheckboxField
  | MaskField
  | PasswordField
  | TextareaField
  | RadioButtonField
  | MultiSelectField
  | TriStateCheckboxField
  | ToggleButtonField
  | SliderField
  | RatingField
  | ColorPickerField
  | PrimeFileUploaderField
  | ChipsField
  | EditorField
  | SelectButtonField
  | ListBoxField
  | KnobField
  | InputSwitchField
  | DividerField
  | ButtonField;
