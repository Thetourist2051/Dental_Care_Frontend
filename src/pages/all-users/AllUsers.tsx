import { useEffect, useState } from "react";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints } from "../../utils/ApiEndpoints";
import { useToaster } from "../../context/toaster-context/ToasterContext";

const AllUsers = () => {
  console.log("All Users Page");
  const [users, setUsers] = useState<any[]>([]);
  const axios = new AxiosService();
  const toaster = useToaster();

  const GetAllUsersData = async () => {
    try {
      const response = await axios.getRequest(ApiEndpoints.Alluser);
      if (response && response.state === 1) {
        toaster.addToast(
          response?.message || "All users Data Fetched Successfully.",
          "success"
        );
        setUsers(response?.data);
      }
      setUsers([]);
    } catch (error: any) {
      console.error("Login Error:", error);
      toaster.addToast(
        error?.message || "An error occurred during login.",
        "error"
      );
    }
  };

  useEffect(() => {
    GetAllUsersData();
  }, []);
  return <>{users || JSON}</>;
};

export default AllUsers;
