import { memo, useEffect, useRef, useState } from "react";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import style from "./BookAppoinments.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";
import {
  FormBuilder,
  FormBuilderHandle,
  FormFieldType,
} from "../../components/form-builder";
import { z } from "zod";

const BookAppointments: React.FC = memo(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const axios = new AxiosService();
  const toaster = useToaster();
  const [appoinmentData, setAppoinmentData] = useState<any[]>([]);

  const getAllAppointmentsData = () => {
    setLoading(true);
    axios
      .getRequest(ApiEndpoints.getAppoinments, UserAuthConfig)
      .then((res: any) => {
        if (res) {
          setLoading(false);
          if (res.state === 1) {
            setAppoinmentData(res?.data);
            toaster.addToast(res?.message, "success");
          } else {
            setLoading(false);
          }
        }
      })
      .catch((err: any) => {
        console.error(err?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllAppointmentsData();
  }, []);

  const grantFormFields: FormFieldType[] = [
    {
      component: "MultiSelect",
      _label: "Employee",
      name: "employee",
      placeholder: "Choose Employee...",
      className: "w-full",

      filter: true,
      options: [
        { label: "Option-1", value: "value_1" },
        { label: "Option-3", value: "value_3" },
        { label: "Option-2", value: "value_2" },
        { label: "Option-4", value: "value_4" },
        { label: "Option-5", value: "value_5" },
        { label: "Option-6", value: "value_6" },
      ],
      _tooltip: "Select the employee to whom this grant will be issued.",
    },
    {
      component: "Dropdown",
      _label: "Policy",
      name: "policy",
      placeholder: "Choose Policy",
      filter: true,
      className: "w-full",
      options: [
        { label: "Option-1", value: "value_1" },
        { label: "Option-3", value: "value_3" },
        { label: "Option-2", value: "value_2" },
        { label: "Option-4", value: "value_4" },
        { label: "Option-5", value: "value_5" },
        { label: "Option-6", value: "value_6" },
      ],
      _tooltip: "Choose the ESOP policy that governs this grant.",
    },
    {
      component: "Dropdown",
      _label: "Vesting Schedule",
      name: "vestingSchedule",
      filter: true,
      placeholder: "Choose Vesting Schedule",
      className: "w-full",
      options: [{ label: "Option-1", value: "value_1" }],
      _tooltip:
        "Select the vesting schedule that defines when options become exercisable.",
    },
    {
      component: "Calendar",
      _label: "Grant Date",
      name: "grantDate",
      placeholder: "Choose Grant Date",
      className: "w-full",
      selectionMode: "single",
      _tooltip: "Set the date on which the options are officially granted.",
      showButtonBar: true,
    },
    {
      component: "InputText",
      _label: "Grant Options",
      name: "grantOptions",
      placeholder: "Enter Grant Options...",
      className: "w-full",
      _tooltip: "Enter the number of ESOP options to be granted.",
    },
    {
      component: "Dropdown",
      _label: "Letter Code",
      name: "letterCode",
      filter: true,
      placeholder: "Select Letter Code",
      className: "w-full",
      options: [{ label: "Option-1", value: "value_1" }],
      _tooltip:
        "Choose the predefined template letter code for the grant letter.",
    },
  ];

  const grantFormSchema = z.object({
    employee: z
      .array(z.string().min(1))
      .min(1, "At least one employee is required!"),
    policy: z.string().min(1, "Policy is required!"),
    vestingSchedule: z.string().min(1, "Vesting Schedule is required!"),
    grantDate: z.coerce.date({
      required_error: "Grant Date is required!",
      invalid_type_error: "Invalid date format!",
    }),
    grantOptions: z.string().min(1, "Grant Options are required!"),
    letterCode: z.string().min(1, "Letter Code is required!"),
  });

  const grantFormRef = useRef<FormBuilderHandle>(null);

  return (
    <>
      {appoinmentData?.length ? (
        <>hi there </>
      ) : (
        <>
          {/* <div className="h-full w-full flex justify-center items-center">
            <div
              className={
                style["no-appointment"] +
                " w-[85%] h-[85%] rounded-2xl bg-amber-100 flex items-center justify-center"
              }
            >
              <img src={ImageUrls.NoAppoinment} className="w-5/10" alt="" />
            </div>
          </div> */}

          <section className={"mt-0 mb-0"}>
            <FormBuilder
              ref={grantFormRef}
              schema={grantFormSchema}
              fields={grantFormFields}
              onSubmit={(data) => console.log(data)}
              aria-label="Grant management form"
            />
          </section>
        </>
      )}
    </>
  );
});

export default BookAppointments;
