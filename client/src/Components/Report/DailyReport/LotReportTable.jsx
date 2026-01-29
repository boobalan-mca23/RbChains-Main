
// import { REACT_APP_BACKEND_SERVER_URL } from '../../../config/config'
// import axios from 'axios'
// import { getLotDatewise } from "../../../Api/processTableApi";
// import LotReportTabelHead from "./LotReportTableHead";
// import LotReportTabelBody from "./LotReportTableBody";
// import LotReportTableFooter from "./LotReportTableFooter";
// import { useState,useMemo,useEffect,useRef} from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";



// const LotReportTable=()=>{
//     const today = new Date().toISOString().split("T")[0];
//     const printRef = useRef()
//     const [loading,setLoading]=useState(true)
//     const [fromDate, setFromDate] = useState(today);
//     const [toDate, setToDate] = useState(today);
//     const [items, setItems] = useState([])
  
//     const footerCalculation =[
//     { rawGold: 0 },
//     { touchValue: 0 },
//     {
//       process: [
//         { processName: "Melting", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
//         { processName: "Wire", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
//         { processName: "Machine", Weight: [{ bw: 0 }, { aw: 0 }, { lw: 0 }] },
//         { processName: "Soldrine", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
//         { processName: "Joint", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
//         { processName: "Cutting", Weight: [{ bw: 0 }, { aw: 0 }, { lw: 0 }, { pw: 0 }] },
//         { processName: "Finishing", Weight: [{ bw: 0 }, { aw: 0 }, { sw: 0 }, { lw: 0 }] },
//       ],
//     },
//     {
//       lotTotal: 0
//     }
//   ];

 
//   const handlePrintPDF = async () => {
//     const input = printRef.current;

//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = 210; // A4 width in mm
//     const pdfHeight = 297; // A4 height in mm

//     const imgProps = pdf.getImageProperties(imgData);
//     const imgWidth = pdfWidth;
//     const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

//     let heightLeft = imgHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//     heightLeft -= pdfHeight;

//     while (heightLeft > 0) {
//       position = position - pdfHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//       heightLeft -= pdfHeight;
//     }

//     pdf.save("Daily-Report.pdf");
//   };
// const handleDateWiseFilter = async () => {
//     try {
//       console.log('fromDate', fromDate);
//       console.log('toDate', toDate);

//       if (fromDate > toDate) {
//         alert('Your Date Order was Wrong');
//         return;
//       }
      
     
//       const res = await getLotDatewise(fromDate, toDate);
//       console.log('DateWiseFilter', res.data.data);
//       setItems(res.data.data)
//       // setCalculation(docalculation(res.data.data))
//       // handleMachineCalculate(res.data.data, calculation)
//       // handleCuttingCalculate(res.data.data, calculation)
//       console.log('itemsAfterDateWiseFilter', items);
//     } catch (error) {
//       console.error('Error fetching data by date:', error.message);
//       alert('Select Date First.');
//     }
//   };
 
//   const docalculation = () => {
//     // Calculation
//     const tempData = [...items];
//     const tempCalculation = structuredClone(footerCalculation);
//     // raw gold calculation
//     let lotTotal = tempData.reduce((acc, item) => {
//       if (item.data && item.data[0]?.ProcessSteps[0]?.AttributeValues[0]?.value) {
//         return acc + item.data[0].ProcessSteps[0].AttributeValues[0].value;
//       }
//       return acc; // skip this item, don't add anything
//     }, 0);
    
//      tempCalculation[0].rawGold = lotTotal;

//    const finishTotal = tempData.reduce((lotAcc, lotData) => {
  
//     const values =
//     lotData?.data?.[7]?.ProcessSteps?.[1]?.AttributeValues ?? [];

//   const lotSum = values.reduce(
//     (attrAcc, item) => attrAcc + (item?.value || 0),
//     0
//   );

//   return lotAcc + lotSum;
// }, 0);


//     tempCalculation[2].process[6].Weight[1].aw = Number(finishTotal)
//     // finish process total
//     let finsihAfterValue = 0;
//     let lotFinishValue = 0;
//     tempData.forEach((lotData, lotIndex) => {// this calculation for lotDifferent Total
//       if (lotData.data) {
//         if (lotData.data[7].ProcessSteps[1].AttributeValues.length === 0) {
//           finsihAfterValue = 0;
//         } else {
//           lotData.data[7].ProcessSteps[1].AttributeValues.forEach((arrItem, arrIndex) => {
//             finsihAfterValue += arrItem.value
//           })
//           lotFinishValue += lotData.data[0].ProcessSteps[0].AttributeValues[0].value - finsihAfterValue
//           finsihAfterValue = 0;
//         }
//       }

//     })
//     tempCalculation[3].lotTotal = lotFinishValue
    
     

//   const sumAttributeValues = (values = []) =>
//   values.reduce((sum, item) => sum + (item?.value || 0), 0);
// // count all process scarp and loss total
// for (let processIndex = 1; processIndex <= 7; processIndex++) {
//   let scrapTotal = 0;
//   let lossTotal = 0;
//   let pureTotal = 0;

//   tempData.forEach((lot) => {
//     const processSteps = lot?.data?.[processIndex]?.ProcessSteps;
//     if (!processSteps) return;

//     // Scrap → step 2
//     scrapTotal += sumAttributeValues(
//       processSteps?.[2]?.AttributeValues
//     );

//    if(processIndex!==3 && processIndex!==6){
     
//     lossTotal += sumAttributeValues(
//       processSteps?.[3]?.AttributeValues
//     );
//   }else{
//     if(processIndex===3){
//       lossTotal=handleMachineCalculate(tempData)

//     }else{
//       const{cuttingLoss,cutting_Puretotal}=handleCuttingCalculate(tempData)
//       lossTotal=cuttingLoss
//       pureTotal=cutting_Puretotal
//     }
//   }
  
  
//   });

//   const process = tempCalculation[2].process[processIndex - 1];

//   // Scrap (exists for all except Machine)
//   if (process.Weight[2]?.sw !== undefined) {
//     process.Weight[2].sw = scrapTotal;
//   }

//   // Normal processes
//   if (processIndex !==3 && processIndex !==6) {
//        process.Weight[3].lw = lossTotal;
//   } else {
//     // mechine and cutting process
//       if(processIndex===6){
//       process.Weight[2].lw = lossTotal;
//       process.Weight[3].pw=pureTotal
//       }else{
//       process.Weight[2].lw = lossTotal;
//       }
    
//   } }

//  return tempCalculation
//   }


//   const handleCuttingCalculate = (tempData) => {
  
    
//     // calculate cutting loss total
//           const { cuttingLoss_total, cuttingScarpBox_total } = tempData.reduce(
//           (acc, lot) => {
//             if (lot.data) {
//               const attrValues = lot.data?.[6]?.ProcessSteps?.[2]?.AttributeValues;

//               if (attrValues?.length >= 1) {
//                 acc.cuttingLoss_total += attrValues.reduce(
//                   (sum, item) => sum + (item.value || 0),
//                   0
//                 );
//               }
//             } else {
//               acc.cuttingScarpBox_total += lot.scarpInfo?.scarp[1].value || 0;
//             }

//             return acc;
//           },
//           { cuttingLoss_total: 0, cuttingScarpBox_total: 0 }
//         );
//         // calculate cutting pure total
//        const cutting_Puretotal = tempData.reduce((sum, lot) => {
//           if (lot.scarpInfo) {
//             return sum + (lot?.scarpInfo?.totalScarp?.[1]?.value || 0);
//           }
//           return sum;
//         }, 0);
   
       
//      return{cuttingLoss:cuttingLoss_total-cuttingScarpBox_total,cutting_Puretotal}

//   }
//   const handleMachineCalculate = (tempData) => {
  
//         const total = tempData.reduce((sum, lot) => {
//         if (lot.scarpInfo) {
//           return sum + (lot.scarpInfo?.totalScarp?.[0]?.value || 0);
//         }
//         return sum;
//         }, 0);
//       return total
  

//   }
//     const calculation = useMemo(() => {
//               return docalculation();
//       }, [items]);
      
// useEffect(() => {
//     const fectchLotDetails = async () => {
//       try {
           
//         const res = await axios.get(`${REACT_APP_BACKEND_SERVER_URL}/api/lot`);
//         if(res.data.status==="ok"){
//             setItems(res.data.data);
//             setLoading(false)
//         }
//       } catch (error) {
//         console.error("Error fetching lot details:", error);

//       }
//     };

//     fectchLotDetails();
//   }, []);
   
//     return(
    
//       <>
//               <LotReportTabelHead
//                  fromDate={fromDate}
//                  toDate={toDate}
//                  setFromDate={setFromDate}
//                  setToDate={setToDate}
//                  handleDateWiseFilter={handleDateWiseFilter}
//                  handlePrintPDF={handlePrintPDF}
//               />
//               <LotReportTabelBody
//                  items={items}
//                  loading={loading}
//                  handleDateWiseFilter={handleDateWiseFilter}
//                  handlePrintPDF={handlePrintPDF}
               
//                  printRef={printRef}
                 

//               />
//               <LotReportTableFooter
//                 calculation={calculation}
//               />
              
//       </>
    
//     )
// }

// export default LotReportTable