import React from "react";
import {TableRow,TableCell} from "@mui/material";
import { styled } from "@mui/material/styles";
const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "5px", });

const LotHeadingRow=(props)=>{
     const {process}=props

    return (
      <>
           {/* First Sub Heading Row*/}
         <TableRow>
                <StyledTableCell style={{
                  borderRight: "3px solid black",
                  }}>
                  <b>Raw Gold</b>
                </StyledTableCell>

                <StyledTableCell style={{
                  borderRight: "3px solid black",

                }} >
                  <b>Touch</b>
                </StyledTableCell >
                
                {process.map((process) => {
                  let colSpanValue = 4;

                  if (process.process_name=== "wire") {
                    colSpanValue = 6
                  }
                  else if (process.process_name === "mechine") {
                    colSpanValue = 3;
                  }

                  return (
                    <StyledTableCell key={process.id} colSpan={colSpanValue} style={{
                      borderRight: "3px solid black",

                    }}>
                      <b>{process.process_name}</b>
                    </StyledTableCell>
                  );
                })}


                <StyledTableCell style={{
                  borderRight: "3px solid black",

                }}>
                  <b>Item Diffrent</b>
                </StyledTableCell>
                <StyledTableCell style={{
                  borderRight: "3px solid black",

                }} >
                  <b>Total Diffrent</b>
                </StyledTableCell >


              </TableRow>
              
            {/* Second Sub Heading Row*/}
            
             <TableRow>
                <StyledTableCell colSpan={2} />
                {process.map((process) => (

                  <React.Fragment key={process.id}>
                    <StyledTableCell >
                      <b>Before</b>
                    </StyledTableCell>

                    {process.process_name === "wire" && (
                      <>
                        <StyledTableCell >
                          <b>Action</b>
                        </StyledTableCell>

                      </>
                    )}
                    {process.process_name === "wire" ? (
                      <StyledTableCell colSpan={2} >
                        <b>After</b>
                      </StyledTableCell>) :
                      (<StyledTableCell >
                        <b>After</b>
                      </StyledTableCell>)}

                    {process.process_name === "mechine" || process.process_name === "cutting" ? ("") : (<StyledTableCell >
                      <b>Scarp</b>
                    </StyledTableCell>)}


                    {process.process_name === "soldring" || process.process_name==="joint"?  (
                      <StyledTableCell style={{
                        borderRight: "3px solid black",

                      }} >
                        <b>+</b>
                      </StyledTableCell>): (
                      <StyledTableCell style={{
                        borderRight: process.process_name === "cutting" ? "none" : "3px solid black"
                      }} >
                        <b>{process.process_name === "cutting" ? "Scarp" : "loss"}</b>
                      </StyledTableCell>)} 

                    {
                      process.process_name === "cutting" && (
                        <StyledTableCell style={{
                          borderRight: "3px solid black",
                        }} >
                          <b>Scarp Pure</b>
                        </StyledTableCell>
                      )
                    }
                  </React.Fragment>
                ))}
                <StyledTableCell colSpan={2} style={{ borderRight: "3px solid black"}} />
              
              </TableRow>
      </>
    )
}
export default LotHeadingRow