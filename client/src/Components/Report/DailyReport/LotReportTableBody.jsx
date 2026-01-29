
import React from "react";
import { styled } from "@mui/material/styles";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Modal, Typography, colors, TableFooter, Autocomplete, Hidden, Grid } from "@mui/material";

const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "6px", });

const LotReportTabelBody=(props)=>{
    const { items,loading}=props
   
   
     return(
      <>
           
          

           {loading ? (

               <TableRow>
                <TableCell >
                 
                    <CircularProgress size="2rem" />
                    <p style={{textAlign:"center"}}>Loading...</p>
                
                </TableCell>
              </TableRow>
             ):(
              <>
            {items.length>=1 ? (
              < >
             
              {
                items.map((lotItem, lotIndex) => (
                  lotItem.data ? (
                    <React.Fragment key={lotIndex+1} >
                        
                        <TableRow  >
                                     {/*RawGold  Box*/}   
                                    <StyledTableCell style={{borderRight: "3px solid black",}}>
                                    
                                  
                                    {
                                        typeof lotItem.data[0]?.ProcessSteps[0]?.AttributeValues[0]?.value === "number"
                                            ? lotItem.data[0]?.ProcessSteps[0]?.AttributeValues[0].value
                                            : ""
                                        }
                                 
                                    
                                    </StyledTableCell>
                                    
                                    {/*Touch  Box*/}

                                    <StyledTableCell>
                                    {lotItem.data[0]?.ProcessSteps[0]?.AttributeValues[0]?.touchValue || " "}
                                    </StyledTableCell>

                                    {/*Melting Before weight Box*/}
                                    <StyledTableCell>
                                        {
                                            typeof lotItem.data[1]?.ProcessSteps[0]?.AttributeValues[0]?.value === "number"
                                            ? lotItem.data[1].ProcessSteps[0].AttributeValues[0].value.toFixed(3)
                                            : ""
                                        }
                                    </StyledTableCell>
                                    
                                    {/*Melting after weight  Box*/}
                                    <StyledTableCell > {lotItem.data[1]?.ProcessSteps[1]?.AttributeValues[0]?.value}</StyledTableCell>

                                {/*Melting scarp  weight  Box*/}
                                    <StyledTableCell> { lotItem.data[1]?.ProcessSteps[2]?.AttributeValues[0]?.value }</StyledTableCell>
                                {/*Melting loss weight Box*/}
                                    <StyledTableCell style={{ borderRight: "3px solid black" }}>{lotItem.data[1]?.ProcessSteps[3]?.AttributeValues[0]?.value}</StyledTableCell>
                                {/*Wire Before  weight  Box*/}
                                    <StyledTableCell> {lotItem.data[2]?.ProcessSteps[0]?.AttributeValues[0]?.value  }</StyledTableCell>

                                {[4, 3, 4, 4, 4, 4, 1].map((span, i) => (
                                        <StyledTableCell 
                                        key={i} 
                                        colSpan={span !== 1 ? span : undefined}
                                        style={{ borderRight: "3px solid black" }} 
                                        />
                                    ))}
                                {
                                    lotItem.data[7]?.ProcessSteps[1]?.AttributeValues.length >= 1 ? (
                                    <StyledTableCell >
                                        <b>{(lotItem.data[0].ProcessSteps[0].AttributeValues[0].value - handleTotal(lotItem.id, 7, 1)).toFixed(3)}</b>
                                    </StyledTableCell>
                                    ) : (<StyledTableCell></StyledTableCell>)
                                }
                        </TableRow>
                {
                  lotItem.data[2].ProcessSteps[1].AttributeValues.map((item, key) => ( 
                    
                    <TableRow key={key} >

                    <StyledTableCell colSpan={7}></StyledTableCell>
                    
                     {/* wiring process after weight */}
                    <StyledTableCell > {lotItem.data[2]?.ProcessSteps[1]?.AttributeValues[key].value} </StyledTableCell>

                      {key === 0 && (
                        <>
                          {/* wiring process scarp weight */}
                          <StyledTableCell >
                              {
                                lotItem.data[2]?.ProcessSteps[2]?.AttributeValues[0]?.value
                              }
                          </StyledTableCell>

                          {/* wiring process loss weight */}
                          <StyledTableCell  style={{ borderRight: "3px solid black" }}>  value={
                              typeof lotItem.data[2]?.ProcessSteps[3]?.AttributeValues[0]?.value === "number"
                                  ? lotItem.data[2].ProcessSteps[3].AttributeValues[0].value.toFixed(3)
                                  : ""
                              }</StyledTableCell>
                        </>
                      )}
                      {/*Mechine Process to final Process */}

                       {
                        lotItem.data.map((lotProcess,lotArrIndex) => (
                        lotArrIndex >= 3 ? (
                            <React.Fragment key={lotArrIndex}>

                           {/* Other Process Before weights*/}
                              <StyledTableCell> 
                                {typeof lotItem.data[lotArrIndex]?.ProcessSteps[0]?.AttributeValues[key]?.value === "number"
                                      ? lotItem.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value
                                      : ""
                                  }  
                            </StyledTableCell>
                               
                              {/* Other Process After weights*/}
                              <StyledTableCell>
                                {lotItem.data[lotArrIndex]?.ProcessSteps[1]?.AttributeValues[key]?.value}
                              </StyledTableCell>
                           
                            {/* Other Process Scarp weights but Mechine and Cutting Process not have scrap weight*/}
                              {lotItem.data[lotArrIndex]?.process_name === "mechine" || lotItem.data[lotArrIndex]?.process_name === "cutting" ? 
                                null: (  
                                <StyledTableCell>
                                {lotItem.data[lotArrIndex]?.ProcessSteps[2]?.AttributeValues[key]?.value}
                                </StyledTableCell>)
                                }
                               
                               {/*Other process loss weights should be stored in position 3, and machine and cutting process weights should be stored in position 2*/}
                              <StyledTableCell style={{ borderRight: lotItem.data[lotArrIndex]?.process_name === "cutting" ? "none" : "3px solid black" }}>
                                {lotItem.data[lotArrIndex]?.process_name === "mechine" || lotItem.data[lotArrIndex]?.process_name === "cutting"? (
                                <>
                                    {
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[2]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                </>
                                ) : (
                                    <>
                                     {
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[3]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                    </>
                                  )}

                              </StyledTableCell>
                               
                               {/* Cutting process only have pure weight */}
                              {lotArrIndex === 6 ? (
                                <StyledTableCell style={{ borderRight: "3px solid black" }}>
                                    {
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[3]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex]?.ProcessSteps[3].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                </StyledTableCell>
                              ) : (" ")
                              }

                            </React.Fragment>
                          ) : (" ")
                        ))
                      } 

                      {
                        
                        lotItem.data[7]?.ProcessSteps[1]?.AttributeValues[key]?.value ?
                          (<StyledTableCell style={{ borderRight: "3px solid black" }}>
                            <p style={{ fontSize: "15px" }}>{(lotItem.data[2]?.ProcessSteps[1]?.AttributeValues[key]?.value - lotItem.data[7]?.ProcessSteps[1]?.AttributeValues[key].value).toFixed(3)}</p>
                          </StyledTableCell>)
                          : (<StyledTableCell style={{ borderRight: "3px solid black" }}></StyledTableCell>)
                      }
                      <StyledTableCell style={{ borderTop: "2px solid white", }}></StyledTableCell> 

                    </TableRow>

                   
                       
                  ))
                }

                 {/* lot calculation table row*/}
                 
                    <TableRow>
                      <StyledTableCell colSpan={7}></StyledTableCell>

                      <StyledTableCell>-</StyledTableCell>
                      {lotItem.data[2].ProcessSteps[1].AttributeValues .length !== 0 ? (
                        <StyledTableCell>
                          {"Total:" + handleTotal(lotItem.id, 2, 1).toFixed(3)}
                        </StyledTableCell>
                      ) : (
                        <StyledTableCell>Total:0</StyledTableCell>
                      )}
                      <StyledTableCell></StyledTableCell>
                      <StyledTableCell
                        style={{ borderRight: "3px solid black" }}
                      ></StyledTableCell>

                      {lotItem.data.map((item, index) =>
                        index >= 3 && index <= 7 ? (
                          <React.Fragment>
                            <StyledTableCell></StyledTableCell>

                            <StyledTableCell>
                              {index === 7
                                ? lotItem.data[7].ProcessSteps[1]
                                    .AttributeValues.length !== 0
                                  ? "Total:" + handleTotal(lotItem.id, 7, 1)
                                  : ""
                                : ""}
                            </StyledTableCell>
                            {index === 3 || index === 6 ? (
                              ""
                            ) : (
                              <StyledTableCell></StyledTableCell>
                            )}
                            <StyledTableCell
                              style={{
                                borderRight:
                                  lotItem.data[index]?.process_name ===
                                  "cutting"
                                    ? "none"
                                    : "3px solid black",
                              }}
                            ></StyledTableCell>
                            {index === 6 ? (
                              <StyledTableCell
                                style={{ borderRight: "3px solid black" }}
                              ></StyledTableCell>
                            ) : (
                              ""
                            )}
                          </React.Fragment>
                        ) : (
                          " "
                        ),
                      )}
                      <StyledTableCell
                        style={{ borderRight: "3px solid black" }}
                      ></StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </TableRow>


                </React.Fragment>

                    ) :
                    (
                      lotItem?.scarpInfo && Object.keys(lotItem.scarpInfo).length > 0 ? ( 
                   <React.Fragment>
                        
                  <TableRow>
                          <StyledTableCell colSpan={11}></StyledTableCell>
                          {/*  mechine scarpBox */}
                          <StyledTableCell colSpan={3} style={{
                            borderLeft: "3px solid black",   
                            borderRight: "3px solid black", 
                            borderTop: "none",               
                            borderBottom: "none"             
                          }} >
                            <Grid container spacing={1}>

                              <Grid container item spacing={1}>
                                <Grid item xs={6} display="flex" alignItems="center">
                                   <TextField
                                    label="Date"
                                    value={new Date(lotItem?.scarpInfo?.createdAt).toLocaleDateString('en-GB')}
                                  >

                                   </TextField>
                                 
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField fullWidth size="small" label="ItemTotal"
                                    value={lotItem?.scarpInfo?.itemTotal[0].value}
                                  />
                                </Grid>
                              </Grid>

                              <Grid container item spacing={1}>
                                <Grid item xs={6}>
                                  <TextField fullWidth size="small" 
                                  value={Number(lotItem?.scarpInfo?.scarp[0]?.value) || ""}
                                    label="Scarp" 
                                    autoComplete="off" />
                                </Grid>

                                <Grid item xs={6}>
                                  <TextField fullWidth size="small" label="Loss" value={(lotItem?.scarpInfo?.totalScarp[0]?.value)?.toFixed(3)} />
                                </Grid>
                              </Grid>
                            </Grid>
                          </StyledTableCell>
                          <StyledTableCell colSpan={8}></StyledTableCell>
                         
                         
                          {/* cutting scarpBox */}
                          <StyledTableCell
                        colSpan={4}
                        style={{
                          borderLeft: "3px solid black",
                          borderRight: "3px solid black",
                          borderTop: "none",
                          borderBottom: "none",
                        }}
                      >
                        <Grid container spacing={1}>
                          <Grid container item spacing={1}>
                            <Grid
                              item
                              xs={6}
                              display="flex"
                              alignItems="center"
                            >
                              <TextField
                                label="Date"
                                value={new Date(lotItem?.scarpInfo?.createdAt).toLocaleDateString('en-GB')}
                              ></TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="ItemTotal"
                                value={lotItem?.scarpInfo?.itemTotal[1].value}
                              />
                            </Grid>
                          </Grid>
 
                          <Grid container item spacing={1}>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                value={Number(lotItem?.scarpInfo?.scarp[1]?.value)|| ""}
                                label="GivenScarp"
                               
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                value={Number(lotItem?.scarpInfo?.touch[1].value) || ""}
                                label="Giventouch"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                value={Number((lotItem?.scarpInfo?.cuttingScarp[1].value).toFixed(3))}
                                label="GivenScarpPure"
                                autoComplete="off"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="BalanceScarpPure"
                                value={(lotItem?.scarpInfo?.totalScarp[1]?.value).toFixed(3)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                         
                          </TableRow> 
                      </React.Fragment>
                  ):null
                )
              ))
              }
             </>):(<><p>No Lot Information</p></>)}
              </>
            
            ) }
      </>
    
    )
}
export default LotReportTabelBody