
import { styled } from "@mui/material/styles";
import { TableCell,TableRow,TextField,Grid } from "@mui/material";

const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "6px",fontSize:"13px" });

const LotReportGrid=(props)=>{
     const {lotScarp}=props
    return(
         <>
               <TableRow>
                        <StyledTableCell colSpan={11}></StyledTableCell>
                        <StyledTableCell colSpan={3} style={{
                          borderLeft: "3px solid black",
                          borderRight: "3px solid black",
                          borderTop: "none",
                          borderBottom: "none"
                        }} >
                          <Grid container spacing={1}>

                            <Grid container item spacing={1} >
                              <Grid item xs={6} display="flex" alignItems="center" width={200}>
                                <TextField
                                  label="Date"
                                 value={new Date(lotScarp?.createdAt).toLocaleDateString('en-GB')}
                                  InputProps={{
                                    style: { fontSize: "12px" }, // this controls the input value font
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }}

                                >

                                </TextField>
                              </Grid>
                              <Grid item xs={6} >
                                <TextField fullWidth label="ItemTotal"
                                  value={lotScarp?.itemTotal[0].value}
                                  InputProps={{
                                    style: { fontSize: "12px" }, // this controls the input value font
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }}

                                />
                              </Grid>
                            </Grid>


                            <Grid container item spacing={1}>
                              <Grid item xs={6}>
                                <TextField fullWidth  value={Number(lotScarp?.scarp[0]?.value) || ""} label="Scarp" InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField fullWidth label="Loss" value={(lotScarp?.totalScarp[0]?.value)?.toFixed(3)} InputProps={{
                                  style: { fontSize: "12px" }, // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell colSpan={8}></StyledTableCell>
                        <StyledTableCell colSpan={4} style={{
                          borderLeft: "3px solid black",
                          borderRight: "3px solid black",
                          borderTop: "none",
                          borderBottom: "none"
                        }} >
                          <Grid container spacing={1}>

                            <Grid container item spacing={1} >
                              <Grid item xs={6} display="flex" alignItems="center" width={200}>
                                <TextField
                                  label="Date"
                                  value={new Date(lotScarp?.createdAt).toLocaleDateString('en-GB')}
                                  InputProps={{
                                    style: { fontSize: "12px" }, // this controls the input value font
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }}

                                >

                                </TextField>
                              </Grid>
                              <Grid item xs={6} >
                                <TextField fullWidth label="ItemTotal"
                                    value={lotScarp?.itemTotal[1].value}
                                  InputProps={{
                                    style: { fontSize: "12px" }, // this controls the input value font
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }}

                                />
                              </Grid>
                            </Grid>


                            <Grid container item spacing={1}>
                              <Grid item xs={6}>
                                <TextField 
                                label="GivenScarp"
                                fullWidth
                                value={Number(lotScarp?.scarp[1]?.value)||""} 
                                InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField fullWidth   value={Number(lotScarp?.touch[1].value) || ""} label="GivenTouch" InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField 
                                fullWidth 
                                value={Number((lotScarp?.cuttingScarp[1].value).toFixed(3))}
                                label="GivenScarpPure" 
                                InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField fullWidth label="BalanceScarpPure" value={Number(lotScarp?.totalScarp[1]?.value)?.toFixed(3)} InputProps={{
                                  style: { fontSize: "12px" }, // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell style={{
                          borderRight: "3px solid black",

                        }} colSpan={6}></StyledTableCell>
                      </TableRow> 
         </>
    
    )
 }

 export default LotReportGrid