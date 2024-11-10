import { useState } from "react";

// @mui material components
import Checkbox from "@mui/material/Checkbox";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import AdminCoverLayout from "layouts/authentication/components/AdminCoverLayout";

// Images
import logo from "assets/images/logo.png";

// react-router-dom components
import { Link, useNavigate, Navigate  } from "react-router-dom";
import { useStateContext } from "context/ContextProvider";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import FixedLoading from "components/General/FixedLoading";
import { useSignInData } from "../data/signinRedux";
import MainLoading from "components/General/MainLoading";
import { passToSuccessLogs, passToErrorLogs } from "components/Api/Gateway";
import { isEmpty } from "components/General/Utils"; 
import { messages } from "components/General/Messages";
import { apiRoutes } from "components/Api/ApiRoutes";

function AdminSignIn() {
  const currentFileName = "layouts/authentication/sign-in/index.js";
  const {token,  setUser, setRole, setAccess, setToken} = useStateContext(); 
  const [submitLogin, setSubmitLogin] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'ADMIN',
  });

  const navigate = useNavigate(); 

  if (token) {
    return <Navigate to="/dashboard" />
  }
  
  const { isLoading, status} = useSignInData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    toast.dismiss();
    if(isEmpty(formData.username) || isEmpty(formData.password)) {
      toast.warning(messages.required, { autoClose: true });
    }
    else {
      setSubmitLogin(true);
      try {
        const response = await axios.post(apiRoutes.login, formData);
        let token = response.data.access_token;
        passToSuccessLogs(response.data.message, currentFileName);
        if (token) {
          setToken(token);
          setUser(response.data.user);
          setRole(response.data.role);
          setAccess(response.data.access);
          navigate("/dashboard");
        }
        else {  
          toast.error(`${response.data.message}`, { autoClose: true });
        }
      } catch (error) {
          toast.error(`Login Failed! ${error}`, { autoClose: true });
          passToErrorLogs(error, currentFileName);
      }
      setSubmitLogin(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const HandleShowPassword = () => setShowPassword(!showPassword);

  return (
    <>
    {status == 1 && !isLoading ? 
    <>
    {submitLogin && <FixedLoading />}
    <AdminCoverLayout
      title="SNHS Voting System"
      description="Login Admin Account"
      image={logo}
    >
      <SoftBox component="form" role="form" onSubmit={handleSubmit}>
        <SoftBox mb={1}>
          <SoftBox ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" color="dark" >
              Username
            </SoftTypography>
          </SoftBox>
          <SoftInput disabled={submitLogin} size="small" type="text"  name="username" value={formData.username} onChange={handleChange}/>
        </SoftBox>
        <SoftBox mb={1}>          
          <SoftBox ml={0.5}>
            <SoftTypography component="label" variant="caption" fontWeight="bold" color="dark">
              Password
            </SoftTypography>
          </SoftBox>
          <SoftInput disabled={submitLogin} size="small" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
        </SoftBox>
        <SoftBox mt={2} mb={1}>
          <SoftButton type="submit" size="small" variant="gradient" color="success" fullWidth>
            sign in
          </SoftButton>
        </SoftBox>
        <SoftBox display={{ sm: "flex" }} justifyContent="space-between" textAlign={{ xs: "start", sm: "end" }}>
          <SoftTypography 
              py={1}
              className="text-nowrap text-xxs  text-decoration-underline me-3"
              component={Link}
              to="/authentication/admin/forgot-password"
              color="info"
              fontWeight="bold"
              // textGradient
            >
              Forgot Password?
          </SoftTypography> 
          <SoftTypography 
              py={1}
              className="text-nowrap text-xxs  text-decoration-underline"
              component={Link}
              to="/authentication/sign-in"
              color="success"
              fontWeight="bold"
              // textGradient
            >
              Login as Student?
          </SoftTypography> 
        </SoftBox>
        <SoftBox>
          <SoftBox display="flex" alignItems="center" py={1}>
              <Checkbox className="border-success" checked={showPassword} onChange={HandleShowPassword} />
              <SoftTypography 
                variant="button"
                className="text-xxs text-nowrap"
                color="dark"
                fontWeight="regular"
                onClick={HandleShowPassword}
                sx={{ cursor: "poiner", userSelect: "none" }}
              >
                &nbsp;Show Password
              </SoftTypography>
          </SoftBox>
        </SoftBox>
        {/* <SoftBox mt={1} mb={0}>
          <SoftTypography className="text-xxs" fontWeight="regular" color="dark">
            <b>Note:</b> Only authorized admin accounts can access the system.
          </SoftTypography>
        </SoftBox> */}
      </SoftBox>
      
    </AdminCoverLayout>
    </> : <MainLoading />
    }
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={5}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        theme="light"
      />
    </>
  );
}

export default AdminSignIn;
