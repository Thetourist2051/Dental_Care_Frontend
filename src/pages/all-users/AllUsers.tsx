import { useEffect, useState } from "react";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";

const AllUsers = () => {
  console.log("All Users Page");
  const [users, setUsers] = useState<any[]>([]);
  const toaster = useToaster();
  const axios = new AxiosService()

  const GetAllUsersData = async() => {
    try {
      const resonse = await axios.getRequest(ApiEndpoints.Alluser,UserAuthConfig)
      if(resonse && resonse.state == 1){
        console.log(resonse)
        setUsers(resonse?.userlist)
      }
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
  return <>Users Page</>;
};

export default AllUsers;
