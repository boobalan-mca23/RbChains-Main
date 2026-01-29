import React, { useState, useEffect, useRef,useMemo} from "react";
import { REACT_APP_BACKEND_SERVER_URL } from '../../config/config'
import axios from 'axios'
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Modal, Typography, colors, TableFooter, Autocomplete, Hidden, Grid } from "@mui/material";
import { getLotDatewise } from "../../Api/processTableApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './dailyReport.css'
import DateRangePicker from "../common/DateRangePicker/DateRangePicker";
import LotReportTabelHead from "./DailyReport/LotReportTableHead";
const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "6px", });
function DailyReport() {

    const today = new Date().toISOString().split("T")[0];
    const printRef = useRef()
    const [loading,setLoading]=useState(true)
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [items, setItems] = useState([])
  
    const footerCalculation =[
    { rawGold: 0 },
    { touchValue: 0 },
    {
      process: [
        { processName: "Melting", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
        { processName: "Wire", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
        { processName: "Machine", Weight: [{ bw: 0 }, { aw: 0 }, { lw: 0 }] },
        { processName: "Soldrine", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
        { processName: "Joint", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
        { processName: "Cutting", Weight: [{ bw: 0 }, { aw: 0 }, { lw: 0 }, { pw: 0 }] },
        { processName: "Finishing", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
      ],
    },
    {
      lotTotal: 0
    }
  ];

  const handleTotal = (lotid, lotProcessId, processId) => {
     const tempData = [...items];
     const lotData = tempData.filter((item,_) => item.lotid === lotid);
 
     const totalValue = lotData[0]?.data[lotProcessId]?.ProcessSteps[processId]?.AttributeValues.reduce(
       (acc, item) => acc + item.value,
       0
     );
     
     return Number(totalValue)||0;
   }

  const handlePrintPDF = async () => {
    const input = printRef.current;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("Daily-Report.pdf");
  };
const handleDateWiseFilter = async () => {
    try {
      console.log('fromDate', fromDate);
      console.log('toDate', toDate);

      if (fromDate > toDate) {
        alert('Your Date Order was Wrong');
        return;
      }
      
     
      const res = await getLotDatewise(fromDate, toDate);
      console.log('DateWiseFilter', res.data.data);
      setItems(res.data.data)
      // setCalculation(docalculation(res.data.data))
      // handleMachineCalculate(res.data.data, calculation)
      // handleCuttingCalculate(res.data.data, calculation)
      console.log('itemsAfterDateWiseFilter', items);
    } catch (error) {
      console.error('Error fetching data by date:', error.message);
      alert('Select Date First.');
    }
  };
 
  const docalculation = () => {
    // Calculation
    const tempData = [...items];
    const tempCalculation = structuredClone(footerCalculation);
    // raw gold calculation
    let lotTotal = tempData.reduce((acc, item) => {
      if (item.data && item.data[0]?.ProcessSteps[0]?.AttributeValues[0]?.value) {
        return acc + item.data[0].ProcessSteps[0].AttributeValues[0].value;
      }
      return acc; // skip this item, don't add anything
    }, 0);
    
     tempCalculation[0].rawGold = lotTotal;

   const finishTotal = tempData.reduce((lotAcc, lotData) => {
  
    const values =
    lotData?.data?.[7]?.ProcessSteps?.[1]?.AttributeValues ?? [];

  const lotSum = values.reduce(
    (attrAcc, item) => attrAcc + (item?.value || 0),
    0
  );

  return lotAcc + lotSum;
}, 0);


    tempCalculation[2].process[6].Weight[1].aw = Number(finishTotal)
    // finish process total
    let finsihAfterValue = 0;
    let lotFinishValue = 0;
    tempData.forEach((lotData, lotIndex) => {// this calculation for lotDifferent Total
      if (lotData.data) {
        if (lotData.data[7].ProcessSteps[1].AttributeValues.length === 0) {
          finsihAfterValue = 0;
        } else {
          lotData.data[7].ProcessSteps[1].AttributeValues.forEach((arrItem, arrIndex) => {
            finsihAfterValue += arrItem.value
          })
          lotFinishValue += lotData.data[0].ProcessSteps[0].AttributeValues[0].value - finsihAfterValue
          finsihAfterValue = 0;
        }
      }

    })
    tempCalculation[3].lotTotal = lotFinishValue
    
     

  const sumAttributeValues = (values = []) =>
  values.reduce((sum, item) => sum + (item?.value || 0), 0);
// count all process scarp and loss total
for (let processIndex = 1; processIndex <= 7; processIndex++) {
  let scrapTotal = 0;
  let lossTotal = 0;
  let pureTotal = 0;

  tempData.forEach((lot) => {
    const processSteps = lot?.data?.[processIndex]?.ProcessSteps;
    if (!processSteps) return;

    // Scrap → step 2
    scrapTotal += sumAttributeValues(
      processSteps?.[2]?.AttributeValues
    );

   if(processIndex!==3 && processIndex!==6){
     
    lossTotal += sumAttributeValues(
      processSteps?.[3]?.AttributeValues
    );
  }else{
    if(processIndex===3){
      lossTotal=handleMachineCalculate(tempData)

    }else{
      const{cuttingLoss,cutting_Puretotal}=handleCuttingCalculate(tempData)
      lossTotal=cuttingLoss
      pureTotal=cutting_Puretotal
    }
  }
  
  
  });

  const process = tempCalculation[2].process[processIndex - 1];

  // Scrap (exists for all except Machine)
  if (process.Weight[2]?.sw !== undefined) {
    process.Weight[2].sw = scrapTotal;
  }

  // Normal processes
  if (processIndex !==3 && processIndex !==6) {
       process.Weight[3].lw = lossTotal;
  } else {
    // mechine and cutting process
      if(processIndex===6){
      process.Weight[2].lw = lossTotal;
      process.Weight[3].pw=pureTotal
      }else{
      process.Weight[2].lw = lossTotal;
      }
    
  } }

 return tempCalculation
  }


  const handleCuttingCalculate = (tempData) => {
  
    
    // calculate cutting loss total
          const { cuttingLoss_total, cuttingScarpBox_total } = tempData.reduce(
          (acc, lot) => {
            if (lot.data) {
              const attrValues = lot.data?.[6]?.ProcessSteps?.[2]?.AttributeValues;

              if (attrValues?.length >= 1) {
                acc.cuttingLoss_total += attrValues.reduce(
                  (sum, item) => sum + (item.value || 0),
                  0
                );
              }
            } else {
              acc.cuttingScarpBox_total += lot.scarpInfo?.scarp[1].value || 0;
            }

            return acc;
          },
          { cuttingLoss_total: 0, cuttingScarpBox_total: 0 }
        );
        // calculate cutting pure total
       const cutting_Puretotal = tempData.reduce((sum, lot) => {
          if (lot.scarpInfo) {
            return sum + (lot?.scarpInfo?.totalScarp?.[1]?.value || 0);
          }
          return sum;
        }, 0);
   
       
     return{cuttingLoss:cuttingLoss_total-cuttingScarpBox_total,cutting_Puretotal}

  }
  const handleMachineCalculate = (tempData) => {
  
        const total = tempData.reduce((sum, lot) => {
        if (lot.scarpInfo) {
          return sum + (lot.scarpInfo?.totalScarp?.[0]?.value || 0);
        }
        return sum;
        }, 0);
      return total
  

  }
    const calculation = useMemo(() => {
              return docalculation();
      }, [items]);
      
useEffect(() => {
    const fectchLotDetails = async () => {
      try {
           
        const res = await axios.get(`${REACT_APP_BACKEND_SERVER_URL}/api/lot`);
        if(res.data.status==="ok"){
            setItems(res.data.data);
            setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching lot details:", error);

      }
    };

    fectchLotDetails();
  }, []);
   
  
  return (
    <>
      {/* <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          color: "black",
          marginBottom: 20,
          textAlign: "center"

        }}
      >
        Daily Lot Report
      </Typography> */}
     
     <DateRangePicker 
          fromDate={fromDate} 
          toDate={toDate} 
          setFromDate={setFromDate} 
          setToDate={setToDate}
          handleDateWiseFilter={handleDateWiseFilter}
          handlePrintPDF={handlePrintPDF}
          page='report'
          / > 

      <div style={{ position: 'relative', overflow: 'auto', maxHeight: '57vh', padding: "10px", margin: "auto" }} className=" hidescrollbar">
        <h3 style={{ textAlign: "center" }}>Daily Lot Report</h3>
        {/* <Table> */}

        <Table ref={printRef}>
           {/* Lot Report Table Head Component */}
           <LotReportTabelHead/>
            
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
            
                                <StyledTableCell colSpan={8}></StyledTableCell>
                                
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
                                      <StyledTableCell style={{borderRight:"3px solid black"}}  >  
                                        {
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
                                  <StyledTableCell colSpan={8}></StyledTableCell>
            
                                  
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
                                 value={new Date(lotItem?.scarpInfo?.createdAt).toLocaleDateString('en-GB')}
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
                                  value={lotItem?.scarpInfo?.itemTotal[0].value}
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
                                <TextField fullWidth  value={Number(lotItem?.scarpInfo?.scarp[0]?.value) || ""} label="Scarp" InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField fullWidth label="Loss" value={(lotItem?.scarpInfo?.totalScarp[0]?.value)?.toFixed(3)} InputProps={{
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
                                  value={new Date(lotItem?.scarpInfo?.createdAt).toLocaleDateString('en-GB')}
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
                                    value={lotItem?.scarpInfo?.itemTotal[1].value}
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
                                value={Number(lotItem?.scarpInfo?.scarp[1]?.value)||""} 
                                InputProps={{
                                  style: { fontSize: "12px" },
                                  // this controls the input value font
                                }}
                                  InputLabelProps={{
                                    style: { fontSize: "15px" }, // this controls the label font
                                  }} />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField fullWidth   value={Number(lotItem?.scarpInfo?.touch[1].value) || ""} label="GivenTouch" InputProps={{
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
                                value={Number((lotItem?.scarpInfo?.cuttingScarp[1].value).toFixed(3))}
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
                                <TextField fullWidth label="BalanceScarpPure" value={Number(lotItem?.scarpInfo?.totalScarp[1]?.value)?.toFixed(3)} InputProps={{
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
                                  </React.Fragment>
                              ):null
                            )
                          ))
                          }
                         </>):(<><p>No Lot Information</p></>)}
                          </>
                        
                        ) }
          {/* <TableFooter>
            <StyledTableCell><p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>RawGold:{(calculation[0].rawGold).toFixed(3)}</p></StyledTableCell>
            <StyledTableCell><p ></p></StyledTableCell>
            {
              calculation[2].process.map((item, key) => (
                <>

                  <StyledTableCell></StyledTableCell>

                  <StyledTableCell>
                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>
                      {item.processName === 'Finishing' ? `${(item.Weight[1].aw).toFixed(3)}` : ""}
                    </p>
                  </StyledTableCell>
                  {item.processName === 'Wire' ? (
                    <>
                      <StyledTableCell></StyledTableCell>

                    </>) : ("")}
                  {
                    item.processName === "Machine" || item.processName === "Cutting" ? ("") : (<StyledTableCell><p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>{(item.Weight[2].sw).toFixed(3)}</p></StyledTableCell>)
                  }
                  <StyledTableCell><p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>{item.processName === "Machine" || item.processName === "Cutting" ? (item.Weight[2].lw).toFixed(3) : (item.Weight[3].lw).toFixed(3)}</p></StyledTableCell>
                  {
                    item.processName === "Cutting" ? (<StyledTableCell><p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>{(item.Weight[3].pw).toFixed(3)}</p></StyledTableCell>) : ("")
                  }



                </>
              ))
            }
            <StyledTableCell></StyledTableCell>
            <StyledTableCell><p style={{ fontSize: "14px", fontWeight: "bold", color: "black" }}>{(calculation[3].lotTotal).toFixed(3)}</p></StyledTableCell>
          </TableFooter> */}
        </Table>

      </div>
    </>
  );
}

export default DailyReport;
