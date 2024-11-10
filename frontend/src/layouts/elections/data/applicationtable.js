// @mui material components
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
// React components
import SoftBox from "components/SoftBox";
import { useStateContext } from "context/ContextProvider";
import { participantSelect, currentDate } from "components/General/Utils";

// React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";
import SoftButton from "components/SoftButton";
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';

function Table({ authUser, elections, tablehead, HandleDATA, HandleRendering }) {
  const {access, role} = useStateContext();
  const { light, secondary } = colors;
  const { size, fontWeightBold } = typography;
  const { borderWidth } = borders;

  const handleViewApplication = (pollid) => {
    HandleDATA(pollid);
    HandleRendering(5);
  }

  const handleViewPoll = (pollid) => {
    HandleDATA(pollid);
    HandleRendering(2);
  }

  const handleSubmitApply = (pollid) => {
    HandleDATA(pollid);
    HandleRendering(4);
  }

  const renderColumns = tablehead.map((head , key) => {
    return (
      <SoftBox
        className={head.padding}
        component="th"
        key={key}
        pt={1.5}
        pb={1.25}
        textAlign={head.align}
        fontSize={size.xxs}
        fontWeight={fontWeightBold}
        color="secondary"
        >
        {head.name.toUpperCase()}
      </SoftBox>
    );
  });

  const renderRows = elections.map((row) => {
    return (
      <TableRow key={row.pollid}>
          <SoftBox
            className="pe-2 text-decoration-underline cursor-pointer fw-bold"
            component="td"
            fontSize={size.xs}
            onClick={() => handleViewPoll(row.pollid)}
            color="dark"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
            sx={{
              "&:hover ": {
                letterSpacing: "2px"        
              },
            }}  
          >
            {row.pollid}
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.pollname}
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.participant_grade === "11,12" ? "All SHS" : 
              row.participant_grade === "7,8,9,10" ? "All JHS" : 
              row.participant_grade === "7,8,9,10,11,12" ? "All Students" : 
              row.participant_grade}
          </SoftBox>
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.application_starts}
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.application_ends}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.validation_ends}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {row.admin_name}    
          </SoftBox>  
          <SoftBox
            className="px-2"
            component="td"
            fontSize={size.xs}
            color="secondary" 
            textAlign="center"
            borderBottom={`${borderWidth[1]} solid ${light.main}`}
            borderTop={`${borderWidth[1]} solid ${light.main}`}
          >
            {(access == 999 || authUser.username === row.admin_id) && row.allowed === "yes"  ?
            <SoftButton onClick={() => handleViewApplication(row.pollid)} className="text-xxxs px-3 rounded-pill" size="small" variant="gradient" color="warning"
              disabled = {currentDate < row.application_start}
            >
                <DescriptionTwoToneIcon className="me-1 p-0"/> View Applications
            </SoftButton>
            : access == 5 && row.allowed === "yes" &&
              <SoftButton onClick={() => handleSubmitApply(row.pollid)} className="text-xxxs px-3 rounded-pill" size="small" variant="gradient" color="warning"
              disabled = {currentDate < row.application_start || currentDate > row.application_end}
            >
                <DescriptionTwoToneIcon className="me-1 p-0"/> Apply for Candidacy
            </SoftButton>
            }
           
          </SoftBox>  
        </TableRow>
    )});

  return (  
      <TableContainer className="shadow-none bg-gray p-3">
        <MuiTable className="table table-sm table-hover table-responsive">  
          <SoftBox component="thead">
            <TableRow>{renderColumns}</TableRow>  
          </SoftBox>  
          <TableBody component="tbody">
            {renderRows}  
          </TableBody>
        </MuiTable> 
      </TableContainer>
  );
}

export default Table;
