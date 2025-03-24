import { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { RootState } from "../../utils/redux-store/appstore";
import { FormField } from "../../utils/FormFieldEnum";
import * as Yup from "yup";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";
import CustomButton from "../../components/custom-button/CustomButton";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import { adduser } from "../../utils/redux-store/userslice";

const ProfilePage: React.FC = memo(() => {
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);
  const [viewProfileForm, setViewProfileForm] = useState<boolean>(true);
  const ProfileFormRef = useRef<CustomDynamicFormHandle>(null);
  const toaster = useToaster();
  const ProfileFormFields: FormField[] = [
    {
      label: "Full Name",
      name: "fullname",
      type: "text",
      placeholder: "Type Name...",
      validation: Yup.string().min(2).max(50).required(),
      fieldclass: "w-4/12",
      addonIcon:'user'
    },
    {
      label: "Email Id",
      name: "email",
      type: "text",
      placeholder: "Type Email Id...",
      validation: Yup.string().email().max(75).required(),
      fieldclass: "w-4/12",
      addonIcon:'envelope',
    },
    {
      label: "Mobile Number",
      name: "mobileno",
      type: "text",
      placeholder: "99-99-99-99-99",
      validation: Yup.string()
        .required()
        .min(10, "Min. Length is 10 !")
        .max(10, "Max. Length is 10 !")
        .required(),
      fieldclass: "w-4/12",
    },
    {
      label: "Emergency/Alternative Contact",
      name: "emergencyContact",
      type: "text",
      placeholder: "99-99-99-99-99",
      validation: Yup.string().notRequired().max(10, "Max. Length is 10 !"),
      fieldclass: "w-4/12",
    },
    {
      label: "Enter your Age",
      name: "age",
      type: "number",
      placeholder: "Type age...",
      fieldclass: "w-4/12",
      validation: Yup.number().min(2).max(150).notRequired(),
    },
    {
      label: "Address",
      name: "address",
      type: "textarea",
      placeholder: "Type Address...",
      validation: Yup.string().max(250).notRequired(),
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
      validation: Yup.string().notRequired(),
      fieldclass: "w-4/12",
    },
    {
      label: "Blood Group",
      name: "bloodgroup",
      type: "select",
      options: [
        { label: "A+", value: "A+" },
        { label: "A-", value: "A-" },
        { label: "B+", value: "B+" },
        { label: "B-", value: "B-" },
        { label: "O+", value: "O+" },
        { label: "O-", value: "O-" },
        { label: "AB+", value: "AB+" },
        { label: "AB-", value: "AB-" },
        { label: "Unknown", value: "Unknown" },
      ],
      validation: Yup.string().notRequired(),
      fieldclass: "w-4/12",
    },
    {
      label: "Medical History",
      name: "medicalHistory",
      type: "textarea",
      placeholder: "Previous Medical History",
      validation: Yup.string().max(150).notRequired(),
      fieldclass: "w-4/12",
    },
    {
      label: "Current Medications",
      name: "currentMedications",
      type: "text",
      placeholder: "Current Medications",
      validation: Yup.string().max(150).notRequired(),
      fieldclass: "w-4/12",
    },
    {
      label: "Blood Pressure",
      name: "bloodPressure",
      type: "text",
      placeholder: "Blood Pressure",
      validation: Yup.string().max(150).notRequired(),
      fieldclass: "w-4/12",
      addonIcon:'mmHg',
      addonPieIcon: false,
      info:"(In mmHG unit)"
    },
    {
      label: "Alcohol Consumption ?",
      name: "alcoholConsumption",
      type: "select",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      validation: Yup.string().notRequired(),
      fieldclass: "w-4/12",
    },
  ];

  const [isFormUpdating, setIsFormUpdating] = useState<boolean>(false);
  const axios = new AxiosService();
  const dispatch = useDispatch();

  const patchProfileForm = () => {
    if (ProfileFormRef && ProfileFormRef?.current && user) {
      const FieldsArr = ProfileFormFields.map((field) => field.name);
      const keys = Object.keys(user);

      keys.forEach((key: string) => {
        if (FieldsArr.includes(key)) {
          if (ProfileFormRef && ProfileFormRef.current) {
            ProfileFormRef.current.setFormValue(key, user[key]);
          }
        }
      });
    }
  };

  useEffect(() => {
    console.log(location.state, "location.state");
    patchProfileForm();
  }, [location]);

  const onUpdateProfile = async () => {
    if (viewProfileForm) {
      setViewProfileForm(false);
    } else {
      if (ProfileFormRef && ProfileFormRef.current) {
        const isValidForm = await ProfileFormRef.current.triggerValidation();
        if (isValidForm) {
          setIsFormUpdating(true);
          const formvalues= ProfileFormRef.current.getFormValues();
          axios.putRequest(ApiEndpoints.UpdateProfile,formvalues,UserAuthConfig).then((res:any)=>{
            if(res ){
              setIsFormUpdating(false);
              if(res.state === 1){
                toaster.addToast(res?.message, 'success');
                dispatch(adduser(res?.updateduser));
              }else{
                setIsFormUpdating(false)
              }
            }
          }).catch((err:any)=>{
            toaster.addToast(err?.message || 'An Unknown Error Occured !', 'error');
            setIsFormUpdating(false)
          })
        } else {
          setIsFormUpdating(true);
          toaster.addToast("Please Fill all the Required Fields", "error");
        }
      }
    }
  };

  return (
    <>
      <h6 className="text-xl mt-0 mb-4">
        {viewProfileForm ? "Update Your Profile" : "Profile Details"}
      </h6>
      <CustomDynamicForm
        ref={ProfileFormRef}
        formFieldsArr={ProfileFormFields}
        viewForm={viewProfileForm}
      />
      <div className="flex justify-end border-t-1 border-gray-400 p-2">
        <CustomButton
          label={viewProfileForm ? "Edit Profile" : "Update Profile"}
          apihitting={isFormUpdating}
          icon={viewProfileForm ? "pencil" : "send"}
          onSubmitEvent={onUpdateProfile}
        />
      </div>
    </>
  );
});

export default ProfilePage;
