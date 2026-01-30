import React from "react";

import {TableCell,TableHead,TableRow} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "6px", });

const LotReportTabelHead=(props)=>{

 
    const processes = ["Melting", "Wire", "Machine", "Soldrine", "Joint", "Cutting", "Finishing"];

    return( 
      <>
         <TableHead style={{ position: 'sticky', top: "0px", zIndex: 10, backgroundColor: '#d8e3e6' }}  >

            <TableRow>
              <StyledTableCell  >
                <b>Raw Gold</b>
              </StyledTableCell >
              <StyledTableCell >
                <b>Touch</b>
              </StyledTableCell >
              {processes.map((process) => {
                let colSpanValue = 4;

                if (process === "Cutting") {
                  colSpanValue = 4;
                }
                if (process === "Wire") {
                  colSpanValue = 5
                }
                else if (process === "Machine") {
                  colSpanValue = 3;
                }

                return (
                  <StyledTableCell key={process} colSpan={colSpanValue} style={{ borderRight: "3px solid black", }} >
                    <b>{process}</b>
                  </StyledTableCell>
                );
              })}
              <StyledTableCell style={{ borderRight: "3px solid black", }} >
                <b>Item Diffrent</b>
              </StyledTableCell>
              <StyledTableCell style={{ borderRight: "3px solid black" }} >
                <b>Total Diffrent</b>
              </StyledTableCell >
            </TableRow>
            <TableRow>
              <StyledTableCell colSpan={2} />
              {processes.map((process) => (

                <React.Fragment key={process}>
                  <StyledTableCell  >
                    <b style={{ fontSize: "11px" }}>Before</b>
                  </StyledTableCell>
                  {process === "Wire" ? (
                    <StyledTableCell colSpan={2}   >
                      <b style={{ fontSize: "11px" }}>After</b>
                    </StyledTableCell>) :
                    (<StyledTableCell  >
                      <b style={{ fontSize: "11px" }}>After</b>
                    </StyledTableCell>)}


                  {process === "Machine" || process === "Cutting" ? ("") : (<StyledTableCell >
                    <b style={{ fontSize: "11px" }}>Scarp</b>
                  </StyledTableCell>)}

                  {process === "Soldrine" || process === "Joint" ? (
                    <StyledTableCell style={{ borderRight: "3px solid black" }}>
                      <b style={{ fontSize: "11px" }}>+</b>
                    </StyledTableCell>) : (
                    <StyledTableCell style={{
                      borderRight: process === "Cutting" ? "none" : "3px solid black"
                    }}  >
                      <b style={{ fontSize: "11px", }} >{process === "Cutting" ? "Scarp" : "loss"}</b>
                    </StyledTableCell>)}

                  {
                    process === "Cutting" && (
                      <StyledTableCell style={{ borderRight: "3px solid black", }}  >
                        <b style={{ fontSize: "11px" }}>ScarpTotal</b>
                      </StyledTableCell>
                    )
                  }
                </React.Fragment>
              ))}
              <StyledTableCell style={{ borderRight: "3px solid black" }} />
              <StyledTableCell style={{ borderRight: "3px solid black" }} />

            </TableRow>
          </TableHead>
      </>
    )
}
export default LotReportTabelHead