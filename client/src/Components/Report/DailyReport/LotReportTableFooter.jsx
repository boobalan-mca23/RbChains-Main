
import {TableCell, TextField,TableFooter} from "@mui/material";

import { styled } from "@mui/material/styles";
import React from "react";
const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "5px", });
const StyledInput = styled(TextField)({ "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiInputBase-input": { textAlign: "center", padding: "2px" }, width: "30px" });

const LotReportTableFooter=(props)=>{
     const {calculation}=props

    return(
     
               <React.Fragment> 

                 <TableFooter
                            sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 10,
                backgroundColor: "#d8e3e6",
              }}>
                              <StyledTableCell><p style={{ fontSize: "17px", fontWeight: "bold", color: "black" }}>Total RawGold:{(calculation[0].rawGold).toFixed(3)}</p></StyledTableCell>
                              <StyledTableCell><p ></p></StyledTableCell>
                              {
                                calculation[2].process.map((item, _) => (
                                  < >
                
                                    <StyledTableCell><StyledInput ></StyledInput></StyledTableCell>
                
                                    <StyledTableCell>
                                      <p style={{ fontSize: "17px", fontWeight: "bold", color: "black" }}>
                                        {item.processName === 'Finishing' ? `FinishTotal  ${(item.Weight[1].aw).toFixed(3)}` : ""}
                                      </p>
                                    </StyledTableCell>
                                    {item.processName === 'Wire' ? (
                                      <>
                                        <StyledTableCell></StyledTableCell>
                                       
                                      </>) : ("")}
                                    {
                                      item.processName === "Machine" || item.processName === "Cutting" ? (""):(<StyledTableCell><p style={{ fontSize: "17px", fontWeight: "bold", color: "black" }}>{item.processName}<br />ScarpTotal:{(item.Weight[2].sw).toFixed(3)}</p></StyledTableCell>)
                                    }
                                    <StyledTableCell><p style={{ fontSize: "17px", fontWeight: "bold", color: "black" }}>{item.processName}<br />LossTotal:{item.processName === "Machine" || item.processName === "Cutting" ? (item.Weight[2].lw).toFixed(3) : (item.Weight[3].lw).toFixed(3)}</p></StyledTableCell>
                                    {
                                      item.processName === "Cutting" ? (<StyledTableCell><p style={{ fontSize: "17px", fontWeight: "bold", color: "black" }}>{item.processName}<br />PureTotal:{(item.Weight[3].pw).toFixed(3)}</p></StyledTableCell>) : ("")
                                    }
                
                                  </>
                                ))
                              }
                              <StyledTableCell></StyledTableCell>
                              <StyledTableCell><p style={{ fontSize: "17px", fontWeight: "bold", color: "black",borderRight:"3px solid black" }}>LotTotal:{(calculation[3].lotTotal).toFixed(3)}</p></StyledTableCell>
                </TableFooter> 
             
             </React.Fragment>

    
   )
}

export default LotReportTableFooter