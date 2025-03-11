import { useRef, useState } from "react";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";
import { FormField } from "../../utils/FormFieldEnum";
import style from "./SignupPage.module.scss";
import * as Yup from "yup";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import { ApiEndpoints } from "../../utils/ApiEndpoints";
import { useNavigate } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import AxiosService from "../../services/axios-service/AxiosService";
import { Button } from "primereact/button";

const SignupPage = () => {
  const signupFormRef = useRef<CustomDynamicFormHandle>(null);
  const toaster = useToaster();
  const [loading, setLoading] = useState<boolean>(false);
  const signupFormFields: FormField[] = [
    {
      label: "Full Name",
      name: "fullname",
      type: "text",
      placeholder: "Type Name...",
      validation: Yup.string().min(2).max(50).required(),
      fieldclass: "w-4/12",
    },
    {
      label: "Email Id",
      name: "email",
      type: "text",
      placeholder: "Type Email Id...",
      validation: Yup.string().email().max(75).required(),
      fieldclass: "w-4/12",
      info: "You can Login into the Portal with Email-Id .",
    },
    {
      label: "Choose Password",
      name: "password",
      type: "password",
      passwordmeter: true,
      placeholder: "Type Password...",
      validation: Yup.string()
        .min(6, "Min length is 6!")
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
      label: "Enter your Age",
      name: "age",
      type: "number",
      placeholder: "Type age...",
      fieldclass: "w-4/12",
      validation: Yup.number().min(2).max(150).required("Age is Required!"),
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      placeholder: "Type Address...",
      validation: Yup.string().max(250).required("Address is required !"),
      fieldclass: "w-4/12",
      rowcount: 2,
    },
    {
      label: "Choose Gender",
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
  ];

  const axios = new AxiosService();
  const navigate = useNavigate();

  const handleFormSubmit = async () => {
    if (signupFormRef.current) {
      const isValid = await signupFormRef.current.triggerValidation();
      if (isValid) {
        setLoading(true);
        let formValues = {};
        formValues = signupFormRef.current.getFormValues();
        console.log("Form Values:", formValues);

        const res = await axios.postRequest(ApiEndpoints.SignupApi, formValues);

        console.log("API Response:", res);

        if (res && res.state === 1) {
          setLoading(false);
          toaster.addToast(res?.message, "success", "Signup");
          return navigate(RouteConstant.LoginPage);
        } else {
          toaster.addToast(
            "Unexpected response from the server",
            "error",
            "Error"
          );
        }
      } else {
        return toaster.addToast(
          "Please fill all required field !",
          "error",
          "Error"
        );
      }
    }
  };

  const handleResetForm = () => {
    if (signupFormRef) {
      signupFormRef.current?.resetForm();
    }
  };

  const onRoutetoLogin = () =>{
    navigate(RouteConstant.LoginPage)
  }

  const handleKeyDownonLogin = (event:any) => {
    console.log('Hello')
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <>
      <div className={style.signup_page}>
        <div
          className={
            style.signup_cover +
            " rounded-2xl p-0 w-9/10 sm:w-9/10 md:w-8/10 lg:w-7/10 bg-white"
          }
        >
          <div
            className={
              style.signup_header +
              " p-4 md:p-5 lg:px-5 lg:py-5 border-b-1 border-gray-300"
            }
          >
            <h6 className="text-xl md:text-2xl my-0 leading-none md:leading-6">
              Register here for{" "}
              <span className={style.header_name}>Dental Care</span>{" "}
            </h6>
            <Button label="" icon="pi pi-arrow-left" className="p-2" onClick={onRoutetoLogin} severity="secondary" tooltip="Back To Login" />
          </div>
          <div
            className={
              style.signup_content + " px-3 pt-3 pb-1 md-p-3 lg:px-4 lg:pt-4"
            }
          >
            <CustomDynamicForm
              ref={signupFormRef}
              formFieldsArr={signupFormFields}
            />
          </div>
          <div className="flex justify-center mt-2 mb-4 md:mb-5">
            <button className="styled_btn2 mr-3" onClick={handleResetForm}>
              <i className="pi pi-refresh"></i>
              <span>Reset Password</span>
            </button>

            <button
              className="styled_btn1"
              disabled={loading}
              onClick={handleFormSubmit}
              onKeyDown={(event)=>handleKeyDownonLogin(event)}
            >
              {loading ? (
                <>
                  <span>Please wait...</span>
                  <i className="pi pi-spin pi-spinner"></i>
                </>
              ) : (
                <>
                  <span>Sign-Up/Register</span>
                  <i className="pi pi-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
