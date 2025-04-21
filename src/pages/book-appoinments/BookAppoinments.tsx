import { memo, useEffect, useState } from "react";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import style from "./BookAppoinments.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";

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

  return (
    <>
      {appoinmentData?.length ? (
        <>hi there </>
      ) : (
        <>
          <div className="h-full w-full flex justify-center items-center">
            <div
              className={
                style["no-appointment"] +
                " w-[85%] h-[85%] rounded-2xl bg-amber-100 flex items-center justify-center"
              }
            >
              <img src={ImageUrls.NoAppoinment} className="w-5/10" alt="" />
            </div>
          </div>
        </>
      )}
    </>
  );
});

export default BookAppointments;
