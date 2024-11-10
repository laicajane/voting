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

function Information({FROM, POLL, POSITIONS, HandleRendering}) {  
  const [deleteData, setDeleteData] = useState(false);
  const currentFileName = "layouts/elections/components/Information/index.js";

  const {token, access} = useStateContext();  
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const pollid = POLL.pollid;
  const handleCancel = () => {
    HandleRendering(1);
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
      title: 'Delete Election?',
      text: "Are you sure you want to delete this? All the data relating to this election such as candidates and positions will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',  
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setDeleteData(true);
          if (!token) {
            toast.error(messages.prohibit, { autoClose: true });
          }
          else {  
            axios.get(apiRoutes.deleteElection, { params: { pollid }, headers })
              .then(response => {
                if (response.data.status == 200) {
                  toast.success(`${response.data.message}`, { autoClose: true });
                } else {
                  toast.error(`${response.data.message}`, { autoClose: true });
                }
                passToSuccessLogs(response.data, currentFileName);
                HandleRendering(1);
                setDeleteData(false);
              })  
              .catch(error => {
                setDeleteData(false);
                toast.error("Cant delete election!", { autoClose: true });
                passToErrorLogs(error, currentFileName);
              });
          }
      }
    })
  };

  return (
    <>  
      {deleteData && <FixedLoading /> }
      <SoftBox mt={5} mb={3} px={2}>
        <SoftBox p={4} className="shadow-sm rounded-4 bg-white" >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} xl={6}>
                <ProfileInfoCard
                    title="Election Information"
                    info={{
                    Election_Name: POLL.pollname,  
                    Description: POLL.description == null ? " " : POLL.description,
                    Participants: POLL.participant_grade == null ? " " : POLL.participant_grade,
                    Qualifications: POLL.qualifications == null ? " " : POLL.qualifications,
                    Requirements: POLL.requirements == null ? " " : POLL.requirements,
                    Admin: POLL.admin_name == null ? " " : POLL.admin_name,
                    Application_Start: POLL.application_starts == null ? " " : POLL.application_starts,
                    Application_End: POLL.application_ends == null ? " " : POLL.application_ends,
                    Validation_End: POLL.validation_ends == null ? " " : POLL.validation_ends,
                    Voting_Start: POLL.voting_starts == null ? " " : POLL.voting_starts,
                    Voting_End: POLL.voting_ends == null ? " " : POLL.voting_ends,
                    }}
                />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
                <Grid container spacing={2}>
                    {POSITIONS && POSITIONS.length > 0 &&
                        <Grid item xs={12}>
                            <ProfileInfoCard
                                title="Positions"
                                info={{
                                    // Loop through positions and add them to the info object
                                    ...POSITIONS.reduce((acc, position, index) => {
                                        acc[`${index + 1}`] = position.position_name || " ";
                                        return acc;
                                    }, {})
                                }}
                            />
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <ProfileInfoCard
                            title="Other Information"
                            info={{
                            Updated_Date: POLL.created_date == null ? " " : POLL.created_date,
                            Updated_By: POLL.updated_by == null ? " " : POLL.updated_by,
                            Created_Date: POLL.created_date == null ? " " : POLL.created_date,
                            Created_by: POLL.created_by == null ? " " : POLL.created_by,
                            }}
                        />
                    </Grid>
                </Grid>
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
            {access == 999 && 
             (FROM === "upcoming" || FROM === "application") &&
            <Grid item xs={12} sm={4} md={2} pl={1}>
              <SoftBox mt={2} display="flex" justifyContent="end">
                <SoftButton onClick={handleDelete} variant="gradient" color="warning" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small">
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
