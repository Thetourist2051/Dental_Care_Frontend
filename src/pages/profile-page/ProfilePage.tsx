import { memo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { RootState } from "../../utils/redux-store/appstore";
import { FormField } from "../../utils/FormFieldEnum";
import * as Yup from "yup";
import CustomDynamicForm, {
  CustomDynamicFormHandle,
} from "../../components/custom-dynamic-form/CustomDynamicForm";

const ProfilePage: React.FC = memo(() => {
  const location = useLocation();
  const user = useSelector((store: RootState) => store.user);

  const ProfileFormRef = useRef<CustomDynamicFormHandle>(null);
  const ProfileFormFields: FormField[] = [
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
      validation: Yup.string()
        .notRequired()
        .max(10, "Max. Length is 10 !"),
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

  const patchProfileForm = () => {
    console.log('Profile Data', user);

    if (ProfileFormRef && ProfileFormRef?.current && user) {
      const FieldsArr = ProfileFormFields.map((field) => field.name);
      const keys = Object.keys(user);

      keys.forEach((key: string) => {
        if (FieldsArr.includes(key)) {
          if (ProfileFormRef && ProfileFormRef.current) {
            if(key === 'alcoholConsumption'){
              user['alcoholConsumption'] = "No";
            }
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

  return (
    <>
      <h6 className="text-xl mt-0 mb-4">Update Your Profile</h6>
      <CustomDynamicForm
        ref={ProfileFormRef}
        formFieldsArr={ProfileFormFields}
      />
    </>
  );
});

export default ProfilePage;
