import { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

// React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// React icons
import Cube from "essentials/Icons/Cube";
import Document from "essentials/Icons/Document";
import Settings from "essentials/Icons/Settings";

// React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import logo from "assets/images/logo.png";
import bgImage from "assets/images/snhs.png";
import Information from "layouts/elections/components/Information";
import EditApplication from "layouts/elections/components/Edit/EditApplication";
import EditOngoing from "layouts/elections/components/Edit/EditOngoing";
import { apiRoutes } from "components/Api/ApiRoutes";
import axios from "axios";
import { passToSuccessLogs } from "components/Api/Gateway";
import { passToErrorLogs } from "components/Api/Gateway";
import { useStateContext } from "context/ContextProvider";
import { toast } from "react-toastify";
import FixedLoading from "components/General/FixedLoading";
import EditUpcoming from "../Edit/EditUpcoming";

function ElectionContainer({authUser, FROM, INFO, HandleRendering}) {
  const currentFileName = "layouts/elections/components/ElectionContainer/index.js";
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);

  const [menu, setMenu] = useState("profile");

  const setProfile = () => {
    setMenu("profile");
    setTabValue(0);
  };
  const setEdit = () => {
    setMenu("edit");
    setTabValue(1);
  };
  const setSettings = () => {
    setMenu("settings");
    setTabValue(2);
  };

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.xsm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const {token, role, access} = useStateContext();
  const YOUR_ACCESS_TOKEN = token; 
  const headers = {
    'Authorization': `Bearer ${YOUR_ACCESS_TOKEN}`
  };

  const [Poll, setPoll] = useState([]);
  const [Position, setPosition] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(true);
  const info = INFO;

  const UpdateLoading = (reloading) => {
    setReload(reloading);
  };

  useEffect(() => {
    if (reload) {
      setReload(true);
      axios.get(apiRoutes.electionInfo, { params: { info }, headers })
        .then(response => {
          if (response.data.status === 200) {
            setPoll(response.data.election);  
            setPosition(response.data.positions);  
          } else {
            toast.error(`${response.data.message}`, { autoClose: true });
          }
          passToSuccessLogs(response.data, currentFileName);
          setReload(false);
          setIsLoading(false);
        })  
        .catch(error => {
          passToErrorLogs(`Election Data not Fetched!  ${error}`, currentFileName);
          setReload(false);
          setIsLoading(false);
        });
    }
  }, [reload]);


  return (
    <>
    {isLoading && <FixedLoading /> }
    <SoftBox position="relative" mt={3}>
      <SoftBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.3),
              rgba(gradients.info.state, 0.1)
            )}, url(${bgImage})`, 
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <SoftAvatar
              src={logo}
              alt="profile-image"
              variant="rounded"
              size="xl"
              shadow="sm"
            />
          </Grid>
          <Grid item>
            <SoftBox height="100%" mt={0.5} lineHeight={1}>
              <SoftTypography variant="h5" fontWeight="medium">
                {Poll.pollname}{" "}
              </SoftTypography>
              <SoftTypography variant="button" color="text" fontWeight="medium">
                {Poll.pollid}{" "}
              </SoftTypography>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={5} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs
                orientation={tabsOrientation}
                value={tabValue}
                onChange={handleSetTabValue}
                sx={{ background: "transparent" }}
              >
                <Tab label="Information" onClick={setProfile} icon={<Cube />} />
                {(FROM === "application" || FROM === "ongoing" || FROM === "upcoming") && 
                  (access == 999 || authUser.username === Poll.admin_id) &&
                  <Tab label="Edit" onClick={setEdit} icon={<Document />} />
                }
                
              </Tabs> 
            </AppBar>
          </Grid>
        </Grid>
      </Card>
    </SoftBox>
    {menu === "profile" && <Information FROM={FROM} POSITIONS={Position} POLL={Poll} HandleRendering={HandleRendering}  />}
    {menu === "edit" && 
      FROM === "application" && 
      <EditApplication UpdateLoading={UpdateLoading} POSITIONS={Position} POLL={Poll} HandleRendering={HandleRendering} />
    }
    {menu === "edit" && 
      FROM === "ongoing" && 
        <EditOngoing UpdateLoading={UpdateLoading} POLL={Poll} HandleRendering={HandleRendering} />
    }
    {menu === "edit" && 
      FROM === "upcoming" && 
        <EditUpcoming UpdateLoading={UpdateLoading} POLL={Poll} HandleRendering={HandleRendering} />
    }
    </>
  );
}

export default ElectionContainer;
