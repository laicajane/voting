// React components
import { Checkbox, Grid} from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftTypography from "components/SoftTypography";
import { toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";
import { useState } from "react";

function EditUpcoming({FROM, POLL, POSITIONS, HandleRendering, UpdateLoading}) {
      const currentFileName = "layouts/admins/components/Add/index.js";
      const [submitProfile, setSubmitProfile] = useState(false);
      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      const initialState = {
            pollid: POLL.pollid == null ? "" : POLL.pollid,
            validation_end: POLL.validation_end == null ? "" : POLL.validation_end,
            voting_start: POLL.voting_start == null ? "" : POLL.voting_start,
            voting_end: POLL.voting_end == null ? "" : POLL.voting_end,
            agreement: false,   
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value, type } = e.target;
        
            if (type === "checkbox") {
                  setFormData({ ...formData, [name]: !formData[name] });
            } else {
                  setFormData((prevData) => {
                  const updatedData = { ...prevData, [name]: value };
                  const validationEnd = new Date(updatedData.validation_end);
                  const votingStart = new Date(updatedData.voting_start);
                  const votingEnd = new Date(updatedData.voting_end);
        
                    // Rule 1: Voting start and end can be equal, but end must be greater than start and greater than validation end
                  if (name === 'voting_start' || name === 'voting_end') {
                        if (votingEnd < votingStart) {
                              toast.dismiss();  
                              toast.warning('Voting End must be greater than or equal to Voting Start.', { autoClose: true });
                              updatedData.voting_end = ''; // Reset voting_end if invalid
                        } else if (votingEnd <= validationEnd) {
                              toast.dismiss();
                              toast.warning('Voting End must be greater than Validation End.', { autoClose: true });
                              updatedData.voting_end = ''; // Reset voting_end if invalid
                        } else if (votingStart <= validationEnd) {
                              toast.dismiss();
                              toast.warning('Voting Start must be greater than Validation End.', { autoClose: true });
                              updatedData.voting_start = ''; // Reset voting_end if invalid
                        }
                  }
        
                  return updatedData;
                });
            }
        };
        

      const handleCancel = () => {
            HandleRendering(1);
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            // Check if all required fields are empty
            const requiredFields = [
                  "validation_end",
                  "voting_start",
                  "voting_end",
            ];
            const emptyRequiredFields = requiredFields.filter(field => !formData[field]);

            if (emptyRequiredFields.length === 0) {
                  if(!formData.agreement) {
                        toast.warning(messages.agreement, { autoClose: true });
                  }
                  else {      
                        setSubmitProfile(true);
                        try {
                              if (!token) {
                                    toast.error(messages.prohibit, { autoClose: true });
                              }
                              else {  
                                    const response = await axios.post(apiRoutes.editUpcoming, formData, {headers});
                                    if(response.data.status == 200) {
                                          toast.success(`${response.data.message}`, { autoClose: true });
                                    } else {
                                          toast.error(`${response.data.message}`, { autoClose: true });
                                    }
                                    UpdateLoading(true);
                                    passToSuccessLogs(response.data, currentFileName);
                              }
                        } catch (error) { 
                              toast.error("Error Updating Election", { autoClose: true });
                              passToErrorLogs(error, currentFileName);
                        }     
                        setSubmitProfile(false);
                  }
                  
            } else {
                  // Display an error message or prevent form submission
                  toast.warning(messages.required, { autoClose: true });
            }
      };

      return (  
      <>
            {submitProfile && <FixedLoading />}   
            <SoftBox mt={5} mb={3} px={2}>      
                  <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                        <SoftTypography fontWeight="medium" color="success" textGradient>
                              Direction!
                        </SoftTypography>
                        <SoftTypography fontWeight="bold" className="text-xs">
                              Please fill in the required fields. Rest assured that data is secured.     
                        </SoftTypography> 
                        <SoftTypography fontWeight="bold" className="text-xxs mt-2">
                              REMINDERS:    
                        </SoftTypography> 
                        <SoftTypography variant="p" className="text-xxs text-secondary span fst-italic">    
                              (Please read before filling up the form) 
                        </SoftTypography> 
                        <ul className="text-danger fw-bold">
                              <li className="text-xxs fst-italic">When the election is upcoming, you can no longer update the election except for voting dates</li>
                        </ul>

                        <SoftBox mt={2}>
                              <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                                    <SoftTypography fontWeight="medium" textTransform="capitalize" color="success" textGradient>
                                          Election Dates
                                    </SoftTypography>
                                    <input type="hidden" name="position5" value={formData.pollid} onChange={handleChange} size="small" /> 
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Validation End: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input 
                                                      className="form-control form-control-sm text-secondary rounded-5"  
                                                      name="validation_end" 
                                                      value={formData.validation_end || ''} 
                                                      onChange={handleChange} 
                                                      type="date" 
                                                      disabled
                                                />
                                          </Grid>
                                    </Grid> 
                                    <Grid container spacing={0} alignItems="center">
                                          <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Voting Start: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input 
                                                      className="form-control form-control-sm text-secondary rounded-5"  
                                                      min={formData.validation_end} 
                                                      name="voting_start" 
                                                      value={formData.voting_start || ''} 
                                                      onChange={handleChange} 
                                                      type="date" 
                                                />
                                          </Grid>
                                          <Grid item xs={12} sm={6} md={4} lg={3} px={1}>
                                                <SoftTypography variant="button" className="me-1"> Voting End: </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
                                                <input 
                                                      className="form-control form-control-sm text-secondary rounded-5"  
                                                      min={formData.voting_start} 
                                                      name="voting_end" 
                                                      value={formData.voting_end || ''} 
                                                      onChange={handleChange} 
                                                      type="date" 
                                                />
                                          </Grid>
                                    </Grid> 
                                    <Grid mt={3} container spacing={0} alignItems="center">
                                          <Grid item xs={12} pl={1}>
                                                <Checkbox 
                                                      className={` ${formData.agreement ? '' : 'border-2 border-success'}`} 
                                                      name="agreement" 
                                                      checked={formData.agreement} 
                                                      onChange={handleChange} 
                                                />
                                                <SoftTypography variant="button" className="me-1 ms-2">Verify Data </SoftTypography>
                                                <SoftTypography variant="p" className="text-xxs text-secondary fst-italic">(Confirming that the information above are true and accurate) </SoftTypography>
                                                <SoftTypography variant="span" className="text-xxs text-danger fst-italic">*</SoftTypography>
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
                                          <Grid item xs={12} sm={4} md={2} pl={1}>
                                                <SoftBox mt={2} display="flex" justifyContent="end">
                                                      <SoftButton variant="gradient" type="submit" className="mx-2 w-100 text-xxs px-3 rounded-pill" size="small" color="success">
                                                            Save
                                                      </SoftButton>
                                                </SoftBox>
                                          </Grid>
                                    </Grid>     
                              </SoftBox>
                        </SoftBox>
                  </SoftBox>
            </SoftBox>
      </>
      );
}

export default EditUpcoming;