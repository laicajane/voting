// React components
import { Checkbox, Grid, Icon, Select, Switch } from "@mui/material";
import FixedLoading from "components/General/FixedLoading";
import SoftBox from "components/SoftBox";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftTypography from "components/SoftTypography";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { messages } from "components/General/Messages";
import { useStateContext } from "context/ContextProvider";
import { passToErrorLogs, passToSuccessLogs  } from "components/Api/Gateway";
import axios from "axios";
import { apiRoutes } from "components/Api/ApiRoutes";

function areRequiredFieldsFilled(formData) {
      const requiredFields = [
            "security_code",
            "newpass",
            "confirmpass",
      ];
      
      for (const field of requiredFields) {
            if (!formData[field]) {
                  return false;
            }
      }
      return true;
      }
      
function Security({USER, HandleRendering, ReloadTable }) {
      const currentFileName = "layouts/users/components/Security/index.js";
      
      const [submitPass, setSubmitPass] = useState(false);

      const {token} = useStateContext();  

      const YOUR_ACCESS_TOKEN = token; 
      const headers = {
            'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
      };

      const initialState = {
            username: USER.username,
            security_code: "",
            password: "",
            newpass: "",
            confirmpass: "",
      };

      const [formData, setFormData] = useState(initialState);

      const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
      };

      const handleCancel = () => {
            HandleRendering(1);
            ReloadTable();
      };
            
      const handleSubmit = async (e) => {
            e.preventDefault(); 
            toast.dismiss();
            if (areRequiredFieldsFilled(formData)) {
                  setSubmitPass(true);
                  try {
                        if (!token) {
                              toast.error(messages.prohibit, { autoClose: true });
                        }
                        else if (formData.newpass !== formData.confirmpass) {
                              toast.error(messages.passNotMatch, { autoClose: true });
                        }
                        else {  
                              const response = await axios.post(apiRoutes.userChangePass, formData, {headers});
                              if(response.data.status == 200) {
                                    toast.success(`${response.data.message}`, { autoClose: true });
                              } else {
                                    toast.error(`${response.data.message}`, { autoClose: true });
                              }
                              passToSuccessLogs(response.data, currentFileName);
                        }
                  } catch (error) { 
                        toast.error(messages.changePassError, { autoClose: true });
                        passToErrorLogs(error, currentFileName);
                  }     
                  setSubmitPass(false);
            }
            else {
                  toast.warning(messages.required, { autoClose: true });
            }
      };

      return (  
      <>
            {submitPass && <FixedLoading />}
            <SoftBox mt={5} mb={3} px={2}>      
                  <SoftBox mb={5} p={4} className="shadow-sm rounded-4 bg-white">
                        <SoftTypography fontWeight="medium" color="success" textGradient>
                              Change Password!
                        </SoftTypography>
                        <SoftTypography fontWeight="bold" className=" text-xs">
                              Please note that this can only be done if the account owner forgot his password.
                        </SoftTypography> 
                        <SoftBox mt={2}>
                              <SoftBox component="form" role="form" className="px-md-0 px-2" onSubmit={handleSubmit}>
                                    <input type="hidden" name="username" value={formData.username} size="small" /> 
                                    <Grid container mt={2} spacing={0} alignItems="center">
                                          <Grid item xs={12} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">System Security Code:</SoftTypography>
                                                <SoftTypography variant="span" className="text-danger text-xs"> *</SoftTypography>
                                          </Grid>
                                          <Grid item xs={12} md={4} px={1}>
                                                <SoftInput name="security_code" type="password" value={formData.security_code} onChange={handleChange} size="small" /> 
                                          </Grid>     
                                    </Grid>
                                    <Grid container mt={2} spacing={0} alignItems="center">
                                          <Grid item xs={12} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">New Password:</SoftTypography>
                                                <SoftTypography variant="span" className="text-danger text-xs"> *</SoftTypography>
                                          </Grid>
                                          <Grid item xs={12} md={4} px={1}>
                                                <SoftInput name="newpass" type="password" value={formData.newpass} onChange={handleChange} size="small" /> 
                                          </Grid>
                                    </Grid>
                                    <Grid container mt={2} spacing={0} alignItems="center">
                                          <Grid item xs={12} md={3} px={1}>
                                                <SoftTypography variant="button" className="me-1">Confirm New Password:</SoftTypography>
                                                <SoftTypography variant="span" className="text-danger text-xs"> *</SoftTypography>
                                          </Grid>
                                          <Grid item xs={12} md={4} px={1}>
                                                <SoftInput name="confirmpass" type="password" value={formData.confirmpass} onChange={handleChange} size="small" /> 
                                          </Grid>
                                    </Grid>
                                    <SoftTypography mt={2} fontWeight="medium" px={1} className=" text-xs text-success">
                                          Note:
                                          <SoftTypography variant="span" className=" ms-2 text-xs text-secondary">Student will use the new password the next time they login.</SoftTypography>
                                    </SoftTypography> 
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
                                                            Update
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

export default Security;
