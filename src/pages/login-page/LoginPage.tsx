import styles from "./LoginPage.module.scss";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";
import * as Yup from "yup";
import { FormField } from "../../utils/FormFieldEnum";
import { useEffect, useRef, useState } from "react";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { useNavigate } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import AxiosService from "../../services/axios-service/AxiosService";
import {
  GetCookieCredentails,
  SaveCredentialstoCookie,
  getAuthToken,
  removeCookieCredentials,
  setAuthToken,
} from "../../services/cookie-service/CookieService";
import { GlobalService } from "../../services/global-service/GlobalService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import { useDispatch } from "react-redux";
import { adduser } from "../../utils/redux-store/userslice";

type Props = {};

function LoginPage({}: Props) {
  const formRef = useRef<CustomDynamicFormHandle>(null);
  const [checked, setChecked] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const toaster = useToaster();
  const axios = new AxiosService();
  const dispatch = useDispatch();

  const formFieldsArr: FormField[] = [
    {
      name: "email",
      type: "text",
      label: "User Email",
      placeholder: "Type Email...",
      validation: Yup.string().required("User Email is required!"),
      addonIcon:'user'
    },
    {
      name: "password",
      type: "password",
      label: "Password",
      passwordmeter: false,
      placeholder: "Type Password...",
      validation: Yup.string().min(6, "Min length is 6!").required(),
      addonIcon:'lock'
    },
  ];

  useEffect(() => {
    const { email, password } = GetCookieCredentails();
    if (email && password && formRef.current) {
      formRef.current.setFormValue("email", email);
      formRef.current.setFormValue("password", password);
    }
  }, []);

  const handleFormSubmit = async () => {
    if (formRef.current) {
      const isValid = await formRef.current.triggerValidation();
      if (isValid) {
        const formValues = formRef.current.getFormValues();

        if (checked) {
          SaveCredentialstoCookie(formValues.email, formValues.password);
        } else {
          removeCookieCredentials();
        }
        setLoading(true);
        axios
          .postRequest(ApiEndpoints.Login, formValues, UserAuthConfig)
          .then((res: any) => {
            if (res) {
              setLoading(false);
              if (res.state === 1) {
                setAuthToken(res?.token);
                console.log(getAuthToken(), "afridi");
                GlobalService.userInfo.next(res?.userInfo);
                dispatch(adduser(res?.userInfo));
                toaster.addToast(res.message, "success");
                return navigate(RouteConstant.BookAppoinments);
              } else if (res.state === -1) {
                toaster.addToast(res.message, "error");
              }
            }
          })
          .catch((err: any) => {
            setLoading(false);
            console.log(err)
            toaster.addToast(err?.response?.data?.message, "error");
          });
      } else {
        console.log("Form has errors.");
        setLoading(false);
      }
    }
  };

  const navigateToSignupPage = () => {
    navigate(RouteConstant.SignupPage, {
      replace: false,
      state: { newuser: true },
    });
  };

  return (
    <>
      <div
        className={styles.login_container + " flex justify-center items-center"}
      >
        <div
          className={
            styles.login_box + " p-4 md:p-6 lg:p-7 bg-white rounded-2xl"
          }
        >
          <h4 className="text-2xl mt-0 mb-5 text-center font-bold">
            Login To <span className="">Dental Care</span>
          </h4>
          <CustomDynamicForm ref={formRef} formFieldsArr={formFieldsArr} />
          <div className="flex justify-between items-center w-full mt-3 px-3">
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
              <label
                htmlFor="rememberMe"
                className="checkbox_label-primary text-sm cursor-pointer"
              >
                Forget/Reset Password
              </label>
            </div>
          </div>
          <div className="flex justify-center my-4">
            <button
              className="styled_btn1"
              disabled={loading}
              onClick={handleFormSubmit}
            >
              {loading ? (
                <>
                  <span>Please wait...</span>
                  <i className="pi pi-spin pi-spinner"></i>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <i className="pi pi-arrow-right"></i>
                </>
              )}
            </button>
          </div>

          <div className="flex justify-center items-center my-4 mx-0">
            <h6 className="checkbox_label">
              Don't Have a Account ?{" "}
              <span
                className="checkbox_label-primary cursor-pointer"
                onClick={() => navigateToSignupPage()}
              >
                Signup/Register Here
              </span>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
