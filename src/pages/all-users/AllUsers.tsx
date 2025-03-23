import { useEffect, useRef, useState } from "react";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import CustomTable from "../../components/custom-table/CustomTable";
import { ThemeButtonProps } from "../../utils/TypescriptEnum";
import { OverlayPanel } from "primereact/overlaypanel";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";

const AllUsers = () => {
  console.log("All Users Page");
  const [users, setUsers] = useState<any[]>([]);
  const toaster = useToaster();
  const axios = new AxiosService();
  const opRef = useRef(null);
  const [rowData, setRowData] = useState<any | null>(null);
  const navigate = useNavigate();

  const GetAllUsersData = async () => {
    try {
      const res = await axios.getRequest(ApiEndpoints.Alluser, UserAuthConfig);
      if (res && res.state == 1) {
        toaster.addToast(res?.message, "success", "Success");
        setUsers(res?.userlist);
      } else {
        setUsers([]);
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      toaster.addToast(
        error?.message || "An error occurred during login.",
        "error"
      );
    }
  };

  const actionTemplate = (rowData: any) => {
    return (
      <>
        <div className="flex justify-start items-center">
          <i
            className="pi pi-ellipsis-v text-base font-bold cursor-pointer"
            onClick={(e) => {
              setRowData(rowData);
              opRef?.current && opRef?.current?.toggle(e);
            }}
          ></i>
        </div>
      </>
    );
  };
  const columns = [
    {
      header: "Action",
      frozen: true,
      body: actionTemplate,
      minWidth: "70px",
      isActionColumn: true,
    },
    {
      header: "Name",
      field: "fullname",
    },
    { field: "email", header: "Email" },
    { field: "address", header: "Address" },
    { field: "age", header: "Age", textAlign: "center" },
    { field: "gender", header: "Gender" },
  ];

  const onAddEvent = () => {
    console.log("Add event");
  };
  const actionButtonArray: ThemeButtonProps[] = [
    {
      label: "Add",
      icon: "plus",
      size: "md",
      onSubmitEvent: () => onAddEvent(),
    },
    {
      label: "Upload",
      icon: "plus",
      size: "md",
      onSubmitEvent: () => onAddEvent(),
    },
  ];

  const onEditUser = () => {
    if(rowData){
      console.log(rowData?._id)
      navigate(RouteConstant.Profilepage,{state:JSON.stringify(rowData)})
    }
  };

  useEffect(() => {
    GetAllUsersData();
  }, []);
  return (
    <>
      <OverlayPanel ref={opRef} className="w-[200px] overlay_panel_class">
        <ul>
          <li>
            <div className="overlayItem" onClick={() => onEditUser()}>
              <i className="pi pi-pencil"></i>
              <h6>Edit</h6>
            </div>
          </li>
          <Divider className="my-1" />
          <li>
            <div className="overlayItem">
              <i className="pi pi-whatsapp"></i>
              <h6>Send Remainder</h6>
            </div>
          </li>
          <Divider className="my-1" />
          <li>
            <div className="overlayItem">
              <i className="pi pi-google"></i>
              <h6>Send Remainder</h6>
            </div>
          </li>
        </ul>
      </OverlayPanel>
      <CustomTable
        tablecolumns={columns}
        tabledata={users}
        actionButtonArray={actionButtonArray}
      />
    </>
  );
};

export default AllUsers;
