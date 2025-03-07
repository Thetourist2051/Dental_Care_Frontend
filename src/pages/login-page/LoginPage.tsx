import styles from "./LoginPage.module.scss";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import CustomButton from "../../components/custom-button/CustomButton";
import { useRef, useState } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

type Props = {};

function LoginPage({}: Props) {
  const formRef = useRef<CustomDynamicFormHandle>(null);
  const [checked, setChecked] = useState<boolean>(true);
  const formFieldsArr: FormField[] = [
    {
      name: "user_email",
      type: "text",
      label: "User Email",
      placeholder: "Type Email...",
      validation: Yup.string().required("User Email is required!"),
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      passwordmeter: false,
      placeholder: "Type Password...",
      validation: Yup.string().min(8, "Min length is 8!"),
    },
  ];

  const handleFormSubmit = async () => {
    if (formRef.current) {
      const isValid = await formRef.current.triggerValidation();
      if (isValid) {
        const formValues = formRef.current.getFormValues();
        console.log("Form Values:", formValues);
      } else {
        console.log("Form has errors.");
      }
    }
  };

  // const patchFormValue = async () => {
  //   console.log("formRef.current:", formRef.current);
  //   if (formRef.current) {
  //     formRef.current.setFormValue("user_email", "example@example.com");
  //     console.log("Form Values After Patching:", formRef.current.getFormValues());
  //   }
  // };

  // const resetForm = () => {
  //   if (formRef.current) {
  //     formRef.current.resetForm();
  //   }
  // };

  return (
    <>
      <div
        className={styles.login_container + " flex justify-center items-center"}
      >
        <div className={styles.login_box + " py-5 px-7 bg-white rounded-2xl"}>
          <h4 className="text-2xl mb-4 text-center font-medium">
            Login To Dental Care
          </h4>
          <CustomDynamicForm ref={formRef} formFieldsArr={formFieldsArr} />
          <div className="flex justify-between items-center w-full">
            <div className="checkbox_class flex items-center">
              <Checkbox
                id="rememberMe"
                onChange={(e: CheckboxChangeEvent) => {
                  setChecked(e?.checked ?? false);
                }}
                checked={checked}
                value={checked}
              ></Checkbox>
              <label htmlFor="rememberMe" className="checkbox_label">
                Remember Me ?
              </label>
            </div>
            <div className="reset_password">
              <label htmlFor="rememberMe" className="checkbox_label-primary cursor-pointer">
                Forget/Reset Password
              </label>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <CustomButton
              type="success"
              icon="check"
              size="md"
              label="Submit"
              styleClass="w-full"
              onSubmitEvent={handleFormSubmit}
            />
          </div>

          <div className="flex justify-center items-center my-4 mx-0">
            <h6 className="checkbox_label">Don't Have a Account ? <span className="checkbox_label-primary cursor-pointer">Signup/Register Here</span></h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
