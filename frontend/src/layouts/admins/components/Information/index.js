// @mui material components
import Grid from "@mui/material/Grid";

// React components
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import { toast } from "react-toastify";
// import Swal from "assets/sweetalert/sweetalert.min.js";

// React examples
import ProfileInfoCard from "essentials/Cards/InfoCards/ProfileInfoCard";
import { useStateContext } from "context/ContextProvider";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";
import { apiRoutes } from "components/Api/ApiRoutes";
import { useState } from "react";
import FixedLoading from "components/General/FixedLoading"; 
import { messages } from "components/General/Messages";
import axios from "axios";  

function Information({USER, HandleRendering, ReloadTable}) {  
  const [deleteUser, setDeleteUser] = useState(false);
  const currentFileName = "layouts/users/components/Information/index.js";
  const {token, role, access} = useStateContext();  
  const username = USER.username;

  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const handleCancel = () => {
    HandleRendering(1);
    ReloadTable();
  };

  const handleDelete = async (e) => {
    e.preventDefault();     
    Swal.fire({
      customClass: {
        title: 'alert-title',
        icon: 'alert-icon',
        confirmButton: 'alert-confirmButton',
        cancelButton: 'alert-cancelButton',
        container: 'alert-container',
        popup: 'alert-popup'
      },
      title: 'Delete Admin?',
      text: "Are you sure you want to delete this data? You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteUser(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteAdmin, { params: { username }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                HandleRendering(1);
                ReloadTable();
                setDeleteUser(false);
              })  
              .catch(error => {
                setDeleteUser(false);
                toast.error("Cant delete admin", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  return (
    <>  
      {deleteUser && <FixedLoading /> }
      <SoftBox mt={5} mb={3} px={2}>
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ProfileInfoCard
                title="Account Information"
                info={{
                  Name: USER.name,  
                  Contact: USER.contact == null ? " " : USER.contact,
                  Gender: USER.gender == null ? " " : USER.gender,
                  Email: USER.email == null ? " " : USER.email,
                  Role: USER.access_level == null ? " " : USER.access_level == 999 ? "Super Admin" : "Admin",
                  Birthdate: USER.birthday == null ? " " : USER.birthday ,
                  Last_Online: USER.last_online,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProfileInfoCard
                  title="Other Information"
                  info={{
                  Updated_Date: USER.created_date == null ? " " : USER.created_date,
                  Updated_By: USER.updated_by == null ? " " : USER.updated_by,
                  Created_Date: USER.created_date == null ? " " : USER.created_date,
                  Created_by: USER.created_by == null ? " " : USER.created_by,
                  }}
              />
            </Grid>
          </Grid>
          <Grid mt={3} container spacing={0} alignItems="center" justifyContent="end">
            <Grid item xs={12} sm={4} md={2} pl={1}>
              <SoftBox mt={2} display="flex" justifyContent="end">
                <SoftButton onClick={handleCancel} className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="light">
                  Back
                </SoftButton>
              </SoftBox>
            </Grid>
            {access >= 999 && role === "ADMIN" && 
            <Grid item xs={12} sm={4} md={2} pl={1}>
              <SoftBox mt={2} display="flex" justifyContent="end">
                <SoftButton onClick={handleDelete} variant="gradient" color="success" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small">
                  Delete
                </SoftButton>
              </SoftBox>
            </Grid>}
          </Grid>   
        </SoftBox>
      </SoftBox>
    </>
  );
}

export default Information;
