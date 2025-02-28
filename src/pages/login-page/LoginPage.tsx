import styles from "./LoginPage.module.scss";
import CustomDynamicForm, { CustomDynamicFormHandle } from "../../components/custom-dynamic-form/CustomDynamicForm";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import ToasterService from "../../services/toaster-service/ToasterService";
import CustomButton from "../../components/custom-button/CustomButton";
import { useRef } from "react";

type Props = {};

function LoginPage({}: Props) {

  const formFieldsArr: FormField[] = [
    {
      name: "user_email",
      type: "text",
      label: "User Email",
      placeholder: "Type Email...",
      validation: Yup.string().required("User Email is required !"),
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      passwordmeter: false,
      placeholder: "Type Password...",
      validation: Yup.string()
        .min(8, "Password must be at least 8 characters!")
        .required("Password is required!"),
    },
    {
      name: "enter_day",
      type: "number",
      label: "Enter Day",
      passwordmeter: false,
      placeholder: "Type day...",
      validation: Yup.string()
        .required("Duration day is required!"),
    },

  ];

  const formRef = useRef<CustomDynamicFormHandle>(null);

  const handleFormSubmit = async () => {
    if (formRef.current) {
      const isFormValid = await formRef.current.triggerValidation();

      if (isFormValid) {
        const formValues = formRef.current.getFormValues();
        console.log("Form Values:", formValues);

      } else {
        ToasterService.show({
          severity: "error",
          summary: "Error",
          detail: "Please fix the errors in the form.",
          life: 3000,
        });
      }
    }
  };

  const patchFormValue = async () => {
    console.log("formRef.current:", formRef.current); // Debugging
    if (formRef.current) {
      formRef.current.setFormValue("user_email", "example@example.com");
      console.log("Form Values After Patching:", formRef.current.getFormValues());
    }
  };
  

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.resetForm();
    }
  };



  return (
    <>
      <div
        className={styles.login_container + " flex justify-center items-center"}
      >
        <div className={styles.login_box + " py-5 px-7 bg-white rounded-2xl"}>
          <h4 className="text-2xl mb-4 text-center font-medium">
            Login To Dental Care
          </h4>
          <CustomDynamicForm
            ref={formRef}
            formFieldsArr={formFieldsArr}
          />
          <div className="flex justify-center my-4">
            <CustomButton
              type="success"
              icon="check"
              size="md"
              label="Submit"
              styleClass="w-full"
              onSubmitEvent={handleFormSubmit}
            />
            <CustomButton
              type="success"
              icon="check"
              size="md"
              label="Patch Value"
              styleClass="w-full"
              onSubmitEvent={()=> patchFormValue()}
            />
            <CustomButton
              type="success"
              icon="check"
              size="md"
              label="Reset"
              styleClass="w-full"
              onSubmitEvent={()=> resetForm()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
