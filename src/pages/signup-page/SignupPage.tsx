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
      fieldclass: "w-4/12",
    },
    {
      label: "Last Name",
      name: "last_name",
      type: "text",
      placeholder: "Type Last Name...",
      validation: Yup.string().min(2).max(50).notRequired(),
      fieldclass: "w-4/12",
    },
    {
      label: "Email Id",
      name: "email",
      type: "text",
      placeholder: "Type Email Id...",
      validation: Yup.string().email().min(5).max(75).notRequired(),
      fieldclass: "w-4/12",
      info: "You can Login into the Portal with Email-Id .",
    },
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Type Username...",
      validation: Yup.string().min(2).max(50).notRequired(),
      fieldclass: "w-4/12",
      info: "You can Login into the Portal with Username .",
    },
    {
      label: "Choose Password",
      name: "password",
      type: "password",
      passwordmeter: true,
      placeholder: "Type Password...",
      validation: Yup.string()
        .min(6, "Min length is 8!")
        .required("Password is Required !"),
      fieldclass: "w-4/12",
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: "password",
      passwordmeter: false,
      placeholder: "Re-type Password...",
      validation: Yup.string()
        .oneOf([Yup.ref("password")], "Password must match!")
        .required("Confirm Password is Required !"),
      fieldclass: "w-4/12",
    },
    {
      label: "Date of Birth",
      name: "dob",
      type: "date",
      placeholder: "Choose Date...",
      fieldclass: "w-4/12",
      validation: Yup.date().max(
        new Date(),
        "Date of Birth cannot be in the future"
      ),
    },
    {
      label: "Gender",
      name: "gender",
      type: "radio",
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Prefer not to say", value: "Other" },
      ],
      validation: Yup.string().required("Gender is required"),
      fieldclass: "w-4/12",
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      placeholder: "Type Address...",
      validation: Yup.string()
        .min(5)
        .max(250)
        .required("Address is required !"),
      fieldclass: "w-4/12",
    },
    {
      label: "Pin Code",
      name: "pincode",
      type: "inputmask",
      mask: "999999",
      validation: Yup.string().length(6, "Pin Code should be in 6 digits"),
      fieldclass: "w-4/12",
      info: "Enter your 6-digit Pin-Code.",
    },
  ];

  const handleFormSubmit = async () => {
    if (signupFormRef.current) {
      const isValid = await signupFormRef.current.triggerValidation();
      if (isValid) {
        const formValues = signupFormRef.current.getFormValues();
        console.log("Form Values:", formValues);
      } else {
        console.log("Form has errors.");
      }
    }
  };

  const handleResetForm = () =>{
    if(signupFormRef){
      signupFormRef.current?.resetForm()
    }
  }

  return (
    <>
      <div className={style.signup_page}>
        <div
          className={
            style.signup_cover +
            " rounded-2xl p-0 lg:w-7/10 md:w-8/10 sm:w-9/10 bg-white"
          }
        >
          <div
            className={
              style.signup_header +
              " lg:px-6 lg:py-4 md:p-4 sm:p-3 border-b-1 border-gray-300"
            }
          >
            <h6 className="text-2xl my-0">
              Register here for{" "}
              <span className={style.header_name}>Dental Care</span>{" "}
            </h6>
          </div>
          <div
            className={
              style.signup_content + " lg:p-6 md:p-4 sm:p-3  min-h-[450px]"
            }
          >
            <CustomDynamicForm
              ref={signupFormRef}
              formFieldsArr={signupFormFields}
            />
            <div className="flex justify-center mt-4">
              <button className="styled_btn2 mr-3" onClick={handleResetForm}>
                <i className="pi pi-refresh"></i>
                <span>Reset Password</span>
              </button>

              <button className="styled_btn1" onClick={handleFormSubmit}>
                <span>Sign-Up/Register</span>
                <i className="pi pi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
