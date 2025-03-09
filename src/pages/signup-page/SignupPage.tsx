import { useRef } from "react";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";
import { FormField } from "../../utils/FormFieldEnum";
import style from "./SignupPage.module.scss";
import * as Yup from "yup";

const SignupPage = () => {
  const signupFormRef = useRef<CustomDynamicFormHandle>(null);
  const signupFormFields: FormField[] = [
    {
      label: "First Name",
      name: "first_name",
      type: "text",
      placeholder: "Type First Name...",
      validation: Yup.string().min(2).max(50).required(),
      fieldclass: "w-3/6",
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
      placeholder: "Type Last Name...",
      validation: Yup.string().min(2).max(50).notRequired(),
      fieldclass: "w-3/6",
    },
    {
      label: "Date of Birth",
      name: "dob",
      type: "date",
      placeholder: "Choose Date...",
      fieldclass: "w-3/6",
      validation: Yup.date()
        .required("Date of Birth is required")
        .max(new Date(), "Date of Birth cannot be in the future"),
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      passwordmeter: false,
      placeholder: "Type Password...",
      validation: Yup.string().min(8, "Min length is 8!"),
      fieldclass: "w-3/6",
    },
    {
      label: "Select a City",
      name: "city",
      type: "select",
      placeholder: "Choose a city",
      options: [
        { label: "New York", value: "NY" },
        { label: "London", value: "LDN" },
        { label: "Paris", value: "PRS" },
      ],
      fieldclass: "w-3/6",
    },
    {
      label: "Select Cities",
      name: "cities",
      type: "multiselect",
      placeholder: "Choose cities",
      options: [
        { label: "New York", value: "NY" },
        { label: "London", value: "LDN" },
        { label: "Paris", value: "PRS" },
      ],
      validation: Yup.array()
        .min(1, "At least one city must be selected") // Required validation for multiselect
        .required("At least one city is required"),
      fieldclass: "w-3/6",
    },
  ];
  return (
    <>
      <div className={style.signup_page}>
        <div
          className={
            style.signup_cover +
            " rounded-2xl p-0 lg:w-6/10 md:w-8/10 sm:w-9/10 bg-white"
          }
        >
          <div
            className={
              style.signup_header +
              " lg:p-6 md:p-4 sm:p-3 border-b-1 border-gray-300"
            }
          >
            <h6 className="text-2xl my-0">
              Register here for{" "}
              <span className={style.header_name}>Dental Care</span>{" "}
            </h6>
          </div>
          <div
            className={
              style.signup_content + " lg:p-6 md:p-4 sm:p-3 min-h-[450px]"
            }
          >
            <CustomDynamicForm
              ref={signupFormRef}
              formFieldsArr={signupFormFields}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
