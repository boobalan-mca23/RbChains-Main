import React, { useState, useEffect, useRef, useMemo } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, Modal, Typography, colors, TableFooter, Autocomplete, Hidden, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createLot, getAllLot, saveLot, getLotDatewise, getProductName,getAllLotProcess } from "../../Api/processTableApi";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import "jspdf-autotable";
import './process.css'
import LotTableHeader from "./LotTableHeader/LotTableHeader";
import LotTableFooter from "./LotTableFooter/LotTableFooter";
import meltingUtils from '../../utils/lot_process/meltingProcessObj'
import wiringUtils from '../../utils/lot_process/wiringProcess'
import otherProcessUtils from '../../utils/lot_process/otherProcess'
import handleLotChildItem from "../../utils/lot_calculation/lotChildItem_Count";



const StyledTableCell = styled(TableCell)({ border: "1px solid #ccc", textAlign: "center", padding: "5px", });
const StyledTableContainer = styled(TableContainer)({ margin: "10px auto", maxWidth: "100%", border: "1px solid #ccc" });
const StyledInput = styled(TextField)({ "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "& .MuiInputBase-input": { textAlign: "center", padding: "2px" }, width: "30px" });

const ProcessTable = () => {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [initialWeight, setInitialWeight] = useState("");
  const [touchValue, setTouchValue] = useState("");
  const [isLotCreated, setIsLotCreated] = useState(false);
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [process,setProcess]=useState([])
  const [loading,setLoading]=useState(true)


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

  const [productName, setProductName] = useState([])
  const touchRef = useRef()
  const saveRef = useRef()
  const meltingRef = useRef({})
  const wiringRef = useRef({})
  const mechineRef = useRef({})
  const cuttingBoxRef=useRef({})

  const melting = (rowId, field) => (el) => {

    if (!meltingRef.current[rowId]) meltingRef.current[rowId] = {};
    meltingRef.current[rowId][field] = el;
  };
  const wiring = (rowId, field) => (el) => {

    if (!wiringRef.current[rowId]) wiringRef.current[rowId] = {};
    wiringRef.current[rowId][field] = el;
  };
  const mechine = (rowId, field, index) => (el) => {
    if (!mechineRef.current[rowId]) mechineRef.current[rowId] = {};
    if (!mechineRef.current[rowId][field]) mechineRef.current[rowId][field] = [];
    mechineRef.current[rowId][field][index] = el;
  };
  const cuttingBox=(rowId, field) => (el) => {

    if (!cuttingBoxRef.current[rowId]) cuttingBoxRef.current[rowId] = {};
    cuttingBoxRef.current[rowId][field] = el;
  };
  const handleKeyCutting=(e,lotid,field)=>{

  if(field=== "cuttingBoxScarp" || field==="cuttingBoxTouch"){
       console.log('lotidcuttingBox',lotid)
        const cuttingBoxFields = ["cuttingBoxScarp", "cuttingBoxTouch"];
        const currentIndex=cuttingBoxFields.indexOf(field)

        let nextField;
         if (e.key === "Enter" || e.key === "ArrowRight") {
        nextField = cuttingBoxFields[currentIndex + 1];
      } else if (e.key === "ArrowLeft") {
        nextField = cuttingBoxFields[currentIndex - 1];
      }

      if (nextField && cuttingBoxRef.current[lotid]?.[nextField]) {
        cuttingBoxRef.current[lotid][nextField].focus();
      }
    }
  }
  const handleKeyDown = (e, rowId, field, index) => {
    const fields = [
      "mechineAfter", "soldringAfter", "soldringScarp",
      "jointAfter", "jointScarp", "cuttingAfter", "finishingAfter", "finishingScarp"
    ];

    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "Enter") { // mechine to finishing process
      const currentIndex = fields.indexOf(field);

      const nextIndex =
        e.key === "ArrowRight" || e.key === "Enter"
          ? currentIndex + 1
          : currentIndex - 1;

      const targetField = fields[nextIndex];

      if (targetField && mechineRef.current[rowId]?.[targetField]?.[index]) {
        mechineRef.current[rowId][targetField][index].focus();
      }
    }
     // handle melting
    // if (e.key === "Enter" || e.key === "ArrowLeft" || e.key === "ArrowRight") {

    if (field === "meltingAfter" || field === "meltingScarp") {
      const meltFields = ["meltingAfter", "meltingScarp"];
      const currentIndex = meltFields.indexOf(field);
      
      let nextField;
      if (e.key === "Enter" || e.key === "ArrowRight") {
        nextField = meltFields[currentIndex + 1];
      } else if (e.key === "ArrowLeft") {
        nextField = meltFields[currentIndex - 1];
      }

      if (nextField && meltingRef.current[rowId]?.[nextField]) {
        meltingRef.current[rowId][nextField].focus();
      }
    }

    // handle wiring
    if (field === "wiringAfter" || field === "wiringScarp") {
      const wiringFields = ["wiringAfter", "wiringScarp"];
      const currentIndex = wiringFields.indexOf(field);
     
      let nextField;
      if (e.key === "Enter" || e.key === "ArrowRight") {
        nextField = wiringFields[currentIndex + 1];
      } else if (e.key === "ArrowLeft") {
        nextField = wiringFields[currentIndex - 1];
      }

      if (nextField && wiringRef.current[rowId]?.[nextField]) {
        wiringRef.current[rowId][nextField].focus();
      }
     }

     
  };
    const handleTotal = (lotid, lotProcessId, processId) => {
    const tempData = [...items];
    const lotData = tempData.filter((item, _) => item.id === lotid);

    const totalValue = lotData[0]?.data[lotProcessId]?.ProcessSteps[processId]?.AttributeValues.reduce(
      (acc, item) => acc + item.value,
      0
    );

    return totalValue||0;
  }

  // footer calculation for all lots and process
  const docalculation = (arrayItems) => {
    // Calculation
    const tempData = [...arrayItems];
    const tempCalculation = structuredClone(footerCalculation);

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
    console.log('finishTotal', finishTotal)

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

    // Loss step rule
    const lossStepIndex =
      processIndex === 3 || processIndex === 6 ? 2 : 3;

    lossTotal += sumAttributeValues(
      processSteps?.[lossStepIndex]?.AttributeValues
    );

    // Pure → ONLY Cutting → step 3
    if (processIndex === 6) {
      pureTotal += sumAttributeValues(
        processSteps?.[3]?.AttributeValues
      );
    }
  });

  const process = tempCalculation[2].process[processIndex - 1];

  // Scrap (exists for all except Machine)
  if (process.Weight[2]?.sw !== undefined) {
    process.Weight[2].sw = scrapTotal;
  }

  // Loss
  if (processIndex === 3 || processIndex === 6) {
    process.Weight[2].lw = lossTotal; // Machine & Cutting
  } else {
    process.Weight[3].lw = lossTotal; // Normal processes
  }

  // Pure (ONLY Cutting)
  if (processIndex === 6) {
    process.Weight[3].pw = pureTotal;
  }
}

    //   console.log('footerCalculation for scw,losw', footerCalculation)
    // }
    return tempCalculation
  }

  const handleInitialChange = (lotid, index, value) => {
    const tempData = [...items];
    const lotData = tempData.find((item,_) => item.id === lotid);
    lotData.data[0].ProcessSteps[0].AttributeValues[0].value = parseFloat(value);
    lotData.data[1].ProcessSteps[0].AttributeValues[0].value = parseFloat(value);
    tempData.splice(index, 1, lotData);
    setItems(tempData)
  }

  const handleTouchChange = (lotid, index, value) => {
 
    const tempData = [...items];
    const lotData = tempData.find((item, index) => item.id === lotid);
   
    lotData.data[0].ProcessSteps[0].AttributeValues[0].touchValue = parseFloat(value);
    //when user change touch value that time also we need to change pure weight
    // if (lotData[0].data[6].ProcessSteps[2].AttributeValues.length != 0) {
    //   lotData[0].data[6].ProcessSteps[2].AttributeValues.forEach((item, index) => {
    //     lotData[0].data[6].ProcessSteps[3].AttributeValues[index].value = lotData[0].data[0].ProcessSteps[0].AttributeValues[0].touchValue * lotData[0].data[6].ProcessSteps[2].AttributeValues[index].value / 100
    //   })
    // }
    tempData.splice(index, 1, lotData[0]);
    setItems(tempData)
    

  };


  const handleMeltingProcess= (lotid,processName,value) => {
    const tempData = [...items];
    const lotData = tempData.find((item) => item.id === lotid);
    const lotIndex=tempData.findIndex((item)=>item.id===lotid)

    if(processName==="afterWeight"){
      // update Melting After weight 
     const updatedState= meltingUtils.updateMeltingAfter(lotData,lotid,value)
     tempData.splice(lotIndex,1,updatedState)
     setItems(tempData)
        
    }else{
      // update Melting Scarp weight 
       const updatedState= meltingUtils.updateMeltingScarp(lotData,lotid,value)
       tempData.splice(lotIndex,1,updatedState)
       setItems(tempData)
    }
  
  }

  const handleAddItemColumns = (lotid, index) => {

    let tempData = [...items];

    let lotData = tempData.find((item) => item.id === lotid);
    let filtered = lotData.data.filter((item) => item.process_name !== "scarpGold" && item.process_name !== "melting");

    filtered.forEach((item,_)=>{

      const {ProcessSteps}=item
          ProcessSteps.forEach((product,_)=>{

      // Skip step id 6 only for process_id = 3
      if (product.id === 6 && product.process_id === 3) {
        return;
      }

      // Steps 8 & 9 → Only allow 1 AttributeValues entry
      if ((product.id === 8 || product.id === 9) &&
          product.AttributeValues?.length >= 1) {
        return;
      }
            let newProduct={
               lot_id:lotid,
               item_id:null,
               attribute_id:product.attribute_id,
               process_step_id:product.id,
               master_jewel_id:null,
               item_name:null,
               index:null,
               touchValue:null,
               value:null
            }
               product.AttributeValues.push(newProduct)
          })
    })
     
    lotData.data.splice(2,6,...filtered)
    tempData.splice(index, 1, lotData);
    const calculateChildItem= handleLotChildItem(tempData)
    setItems(calculateChildItem);

  
  };
  const handleChildItemName = (lotid, childIndex, itemName, master_jewel_id, touchValue) => {
   
    const tempData = [...items];
    
    const lotData = tempData.find((item) => item.id === lotid);
    const lotIndex=tempData.findIndex((item)=>item.id===lotid)
  
     let filtered = lotData.data.filter((item) => item.process_name !== "scarpGold" && item.process_name !== "melting");
     filtered.forEach((item,_)=>{

      const {ProcessSteps}=item
          ProcessSteps.forEach((product,_)=>{

            if(product.id===6&&product.process_id===3){
               return;
            }
             if((product.id===8||product.id===9) && product.process_id===3){
               return;
            }
              
               product.AttributeValues[childIndex].item_name=String(itemName)
               product.AttributeValues[childIndex].master_jewel_id=master_jewel_id
               product.AttributeValues[childIndex].touchValue=touchValue

           })
    })
   
    lotData.data.splice(2,6,...filtered)
    tempData.splice(lotIndex, 1, lotData);
    setItems(tempData)

  }

  const handleWiringProcess = (lotid, childIndex, itemWeight,attribute_id) => {
    const tempData = [...items];
    const lotData = tempData.find((item, index) => item.id === lotid);
    const lotIndex=tempData.findIndex((item)=>item.id===lotid)

    if (attribute_id === 3) {
      //After  
      const updatedState=wiringUtils.updateWiringAfter(lotData,childIndex,itemWeight)
      console.log('updatedState for wiring after',updatedState)
      tempData.splice(lotIndex, 1, lotData);
     }
    if (attribute_id === 4) {
      // scarp
      const updatedState=wiringUtils.updateWiringScarp(lotData,childIndex,itemWeight)
      console.log('updatedState for wiring scarp',updatedState)
      tempData.splice(lotIndex, 1, lotData);
    }

    setItems(tempData);
   
  }

  const handleCreateLot = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 

  const handleMechineScarp = (value, date) => {
    
    const tempData=[...items]
     // first we find the correct scarp box with date
    const lotInfo = tempData.filter(item =>item?.date?.split("T")[0] === date?.split("T")[0]);
    const total = lotInfo.reduce((sum, lot) => {

    return (
      sum +
      (lot.data?.[3]?.ProcessSteps?.[2]?.AttributeValues
        ?.reduce((a, i) => a + (Number(i.value) || 0), 0) || 0)
    );
    }, 0);

     const scarpBoxIndx=tempData.findIndex((scarp,_)=> (scarp?.scarpInfo?.createdAt.split("T")[0])===date.split("T")[0])
     const scarp=tempData[scarpBoxIndx]
 
     
     scarp.scarpInfo.scarp[0].value=value
     scarp.scarpInfo.totalScarp[0].value=value-total
     console.log('scarp',scarp)

      // then count loss value for each lot in mechine process 
      tempData.splice(scarpBoxIndx,1,scarp)
      setItems(tempData);

   
  };

  const handleCuttingScarp=(value,date,option)=>{
    console.log(value,date,option)
    const tempData=[...items]
     // first we find the correct scarp box with date
    const lotInfo = tempData.filter(item =>item?.date?.split("T")[0] === date?.split("T")[0]);
  

    
    const total = lotInfo.reduce((sum, lot) => {

    return (
      sum +
      (lot.data?.[6]?.ProcessSteps?.[3]?.AttributeValues
        ?.reduce((a, i) => a + (Number(i.value) || 0), 0) || 0)
    );
    }, 0);

   
     const scarpBoxIndx=tempData.findIndex((scarp,_)=> (scarp?.scarpInfo?.createdAt.split("T")[0])===date.split("T")[0])
     const scarp=tempData[scarpBoxIndx]
     console.log('scarp',scarp)


     if(option==="scarp"){
    
       
        // if cutting scarp
      scarp.scarpInfo.scarp[1].value=value
      scarp.scarpInfo.cuttingScarp[1].value= value * scarp.scarpInfo.touch[1].value/100
      scarp.scarpInfo.totalScarp[1].value=scarp.scarpInfo.cuttingScarp[1].value-total
     }else{
      // if cutting touch
      scarp.scarpInfo.touch[1].value=value
      scarp.scarpInfo.cuttingScarp[1].value=scarp.scarpInfo.scarp[1].value * value /100
      scarp.scarpInfo.totalScarp[1].value=scarp.scarpInfo.cuttingScarp[1].value-total
     }

    
     tempData.splice(scarpBoxIndx,1,scarp)
     

      setItems(tempData);
 
  }

 const allData = async () => {
   
        const res = await getAllLot();
         // console.log('useEffect data', res);
         setItems(res)
        // setCalculation(docalculation([]))
        // console.log('after calculation', calculation);
        setTimeout(()=>setLoading(false),1000)
   
   
  }
  const allProcess=async()=>{
      const res=await getAllLotProcess()
      setProcess(res)
  }

  const getProduct = async () => {
    const res = await getProductName();
    console.log('getProductName', res);
    setProductName(res)

  }
  const handleSave = async () => {
    try {

    
      if (initialWeight && touchValue) {

        await createLot(initialWeight, touchValue); // Response is an object
        allData() // refetch all lots information

        // const tempRes = handleLotChildItem(response)
        // console.log('tempRes', tempRes)
        // setItems(response)
        
        console.log('items after save', items) // Ensure prevItems is an array
        setInitialWeight("");
        setTouchValue("");// Clear input field
        setOpen(false);
        setIsLotCreated(true);
        toast.success("Lot Created", { autoClose: 2000 });
      } else {
        toast.warn("Enter Lot Details", { autoClose: 2000 });
      }

    } catch (error) {
      setInitialWeight("");
      setTouchValue("");
      toast.warn('Error On Create Lot', { autoClose: 1500 })
    };
  }

  // console.log("Processes:", processes);

  const handleSaveData = async () => {
    try {
      console.log('handleSaveData', items);

      // const res = await saveLot(items);
      // console.log('res from save function', res.data.data)
      // setItems(res.data.data)
      // setCalculation(docalculation(res.data.data))
      // handleMachineCalculate(res.data.data, calculation)
      // handleCuttingCalculate(res.data.data,calculation)
      // toast.success("Lot Saved", { autoClose: 2000 });
    } catch (err) {
      console.log("Enter Lot Information")
    }

  }
  // const handleCuttingCalculate = (response, calculation) => {
  //   const tempData = response;
  //   const tempCal = [...calculation]
  //   // calculate cutting loss total
  //   let cuttingScarpBox_total=0,cuttingLoss_total=0;
  //   for (const lot of tempData) {
  //     if (lot.data) {
      
  //       if(lot.data[6]?.ProcessSteps[2]?.AttributeValues.length>=1){
  //         cuttingLoss_total+=lot.data[6]?.ProcessSteps[2]?.AttributeValues.reduce((acc,item)=>acc+item.value,0)
  //       }
  //     }else{
  //        cuttingScarpBox_total+=lot.scarpBox[1].cutting.scarp
  //      }
  //   }
  //   console.log('cuttingLossTotal',cuttingLoss_total)
  //   console.log('cuttingScarpBox',cuttingScarpBox_total)
    
  //   tempCal[2].process[5].Weight[2].lw = cuttingLoss_total-cuttingScarpBox_total

  //   // calculate cutting pure total
  //   let cutting_total = 0;
  //   for (const lot of tempData) {
  //     if (lot.scarpBox) {
  //       cutting_total += lot.scarpBox[1].cutting.totalScarp
  //     }
  //   }

  //   tempCal[2].process[5].Weight[3].pw = cutting_total
  //   setCalculation(tempCal)

  // }
  // const handleMachineCalculate = (response, calculation) => {
  //   const tempData = response;
  //   const tempCal = [...calculation]
  //   let total = 0;
  //   for (const lot of tempData) {
  //     if (lot.scarpBox) {
  //       total += lot.scarpBox[0].mechine.totalScarp
  //     }
  //   }
  //   tempCal[2].process[2].Weight[2].lw = total
  //   setCalculation(tempCal)

  // }
 
  const handleOtherProcess = (lotid, lotDate, attribute_id, value, key, process_id, lotArrIndex) => {
    const tempData = [...items];
    const lotData = tempData.find((item) => item.id === lotid);
    const lotIndex= tempData.findIndex((item) => item.id ===lotid)

    // child Items Value Carry Forward here!!!
    if (attribute_id === 3) { //child item After weight Update
        const updatedState=otherProcessUtils.handleOtherProcessAfterWeight(lotData,lotArrIndex,key,value,process_id)
        handleScarpBoxTotal(lotDate,process_id)
        tempData.splice(lotIndex, 1, updatedState);
        
        setItems(tempData);
      } else if (attribute_id === 4) {//child item Scarp weight Update
        handleScarpBoxTotal(lotDate,process_id)
        const updatedState=otherProcessUtils.handleOtherProcessScrapWeight(lotData,lotArrIndex,key,value)
        
       tempData.splice(lotIndex, 1, updatedState);
       setItems(tempData);

      }
  }
 
   const handleScarpBoxTotal = (lotDate, process_id) => {
    const tempData = [...items];
    // first find lost info related the date
    const lotInfo = tempData.filter(item =>item?.date?.split("T")[0] === lotDate?.split("T")[0]);

   // then count loss value for each lot in mechine process and cutting
   const total = lotInfo.reduce((sum, lot) => {
  if (process_id === 4) {
    return (
      sum +
      (lot.data?.[3]?.ProcessSteps?.[2]?.AttributeValues
        ?.reduce((a, i) => a + (Number(i.value) || 0), 0) || 0)
    );
  }

  return (
    sum +
    (lot.data?.[6]?.ProcessSteps?.[3]?.AttributeValues
      ?.reduce((a, i) => a + (Number(i.value) || 0), 0) || 0)
  );
}, 0);

    const scarpBoxIndx=tempData.findIndex((scarp,_)=> (scarp?.scarpInfo?.createdAt.split("T")[0])===lotDate.split("T")[0])
    const scarp=tempData[scarpBoxIndx]
   
    // then update the loss to scarp box
    if(process_id===4){
  
      scarp.scarpInfo.totalScarp[0].value=Number((total).toFixed(3))
    }else{
     
      scarp.scarpInfo.totalScarp[1].value=Number((total).toFixed(3))
    }
  
    tempData.splice(scarpBoxIndx,1,scarp)

    setItems(tempData);
  };

 
  const handleDateWiseFilter = async () => {
    try {
      console.log('fromDate', fromDate);
      console.log('toDate', toDate);


      if (fromDate > toDate) {
        alert('Your Date Order was Wrong');
        return;
      }
      setItems([])
     
      const res = await getLotDatewise(fromDate, toDate);
      console.log('DateWiseFilter', res.data.data);
      // const tempRes=handleLotChildItem(res.data.data)
 
      setItems(res.data.data)
      // setCalculation(docalculation(res.data.data))
      // handleMachineCalculate(items, calculation)
      // handleCuttingCalculate(items,calculation)
      getProduct()
      console.log('itemsAfterDateWiseFilter', items);
    } catch (error) {
      console.error('Error fetching data by date:', error.message);
      alert('Select Date First.');
    }
  };
  // useEffect(() => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  //   const day = String(today.getDate()).padStart(2, '0');

  //   const currentDate = `${year}-${month}-${day}`;
  //   console.log('currentDate', currentDate);

  //   setFromDate(currentDate);
  //   setToDate(currentDate);
  // }, []);

  useEffect(() => {
    // Get current date in UTC
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    setFromDate(formattedDate);
    setToDate(formattedDate);
  }, []);



  useEffect(() => {
    allData()
    getProduct()
    allProcess()

  }, [])
  
    const calculation = useMemo(() => {
            return docalculation(items);
    }, [items]);


  // useEffect(() => {
   
   
  //   // setCalculation(docalculation(items))
  //   // handleMachineCalculate(items, calculation)
  //   // handleCuttingCalculate(items,calculation)

  // }, [items])

  const billRef = useRef(null);

  const tableRef = useRef(null);

  return (
    <Box sx={{ padding: "20px" }} ref={billRef}>
      <Box sx={{ textAlign: "right", marginBottom: "0px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateLot}
          sx={{ marginRight: "10px" }}

        >
          AddItem
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSaveData}
          sx={{ marginRight: "10px" }}

        >
          Save
        </Button>

      </Box>
      {/* DateWiseFilter */}

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: 0, position: 'relative' }}>
          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <Button variant="contained" onClick={() => { handleDateWiseFilter() }}>Filter</Button>
        </div>
      </div>


      <StyledTableContainer component={Paper} >
        <div ref={tableRef} style={{ position: 'relative', overflow: 'auto', maxHeight: '57vh' }}>

          <Table >
           <LotTableHeader process={process}/>
           <TableBody  >
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
                        <StyledTableCell style={{borderRight: "3px solid black",}}>
                          
                          {/*RawGold Input Box*/}
                          <StyledInput
                            value={
                              typeof lotItem.data[0].ProcessSteps[0].AttributeValues[0].value === "number"
                                ? lotItem.data[0].ProcessSteps[0].AttributeValues[0].value
                                : ""
                            }
                            onChange={(e) =>
                              handleInitialChange(lotItem.id, lotIndex, e.target.value)
                            }
                            type="number"
                            style={{ width: "120px" }}
                            autoComplete="off"
                          />
                        </StyledTableCell>
                        
                        {/*Touch Input Box*/}

                        <StyledTableCell style={{borderRight: "3px solid black",}}>
                          <StyledInput
                            value={lotItem.data[0].ProcessSteps[0].AttributeValues[0].touchValue || " "}
                            onChange={(e) => {
                              handleTouchChange(lotItem.id, lotIndex, e.target.value)
                            }}
                            type="number"
                            style={{ width: "120px" }}
                            autoComplete="off"
                          />
                        </StyledTableCell>

                        {/*Melting Before weight Input Box*/}
                        <StyledTableCell>
                            <StyledInput 
                              value={
                                typeof lotItem.data[1]?.ProcessSteps[0]?.AttributeValues[0]?.value === "number"
                                  ? lotItem.data[1].ProcessSteps[0].AttributeValues[0].value.toFixed(3)
                                  : ""
                              }
                              style={{ width: "120px" }}
                               autoComplete="off"
                            />

                        </StyledTableCell>
                        
                        {/*Melting after weight Input Box*/}
                        <StyledTableCell >
                          <StyledInput 
                            value={
                               lotItem.data[1]?.ProcessSteps[1]?.AttributeValues[0]?.value
                              }
                            onChange={(e) => handleMeltingProcess(
                              lotItem.id,
                              lotItem.data[1]?.ProcessSteps[1]?.AttributeInfo.attribute_name,e.target.value)}
                            type="number"
                            autoComplete="off"
                            style={{ width: "120px" }}
                            // inputRef={melting(lotItem.lotid, 'meltingAfter')}
                            // onKeyDown={(e) => handleKeyDown(e, lotItem.lotid, 'meltingAfter')}
                          />
                        </StyledTableCell>

                    {/*Melting scarp  weight Input Box*/}
                        <StyledTableCell>
                          <StyledInput 
                            disabled={!(lotItem.data[1]?.ProcessSteps[1]?.AttributeValues.length===1)}
                            value={ lotItem.data[1]?.ProcessSteps[2]?.AttributeValues[0]?.value
                              }
                            onChange={(e) => handleMeltingProcess(lotItem.id, 
                            lotItem.data[1]?.ProcessSteps[2]?.AttributeInfo.attribute_name,
                             e.target.value,)}
                            type="number"
                            autoComplete="off"
                            style={{ width: "120px" }}
                            // inputRef={melting(lotItem.lotid, 'meltingScarp')}

                          />
                        </StyledTableCell>
                    {/*Melting loss weight Input Box*/}
                        <StyledTableCell style={{ borderRight: "3px solid black" }}>

                          <StyledInput 
                            value={ lotItem.data[1]?.ProcessSteps[3]?.AttributeValues[0]?.value}
                            style={{ width: "120px" }}
                             autoComplete="off"
                          />
                        </StyledTableCell>
                    {/*Wire Before  weight Input Box*/}
                        <StyledTableCell>
                          <StyledInput 
                            value={
                              lotItem.data[2]?.ProcessSteps[0]?.AttributeValues[0]?.value
                            }
                             autoComplete="off"
                            style={{ width: "120px" }}
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"  
                            onClick={() => handleAddItemColumns(lotItem.id, lotIndex)}
                            style={{ minWidth: "32px", padding: "4px" }} 
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        </StyledTableCell>

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
                   
                   {/* item name drop down*/}
                      <Autocomplete
                        style={{ margin: "10px" }}
                        options={productName}
                        getOptionLabel={(option) => option.jewel_name || ""}
                        value={{
                          jewel_name:lotItem.data[2]?.ProcessSteps[1]?.AttributeValues[key].item_name || "",
                          master_jewel_id:lotItem.data[2]?.ProcessSteps[1]?.AttributeValues[key].master_jewel_id || "",
                        }}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            handleChildItemName(
                              lotItem.id,
                              key,
                              newValue.jewel_name,
                              newValue.master_jewel_id,
                              lotItem.data[0]?.ProcessSteps[0]?.AttributeValues[0].touchValue
                            );
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.master_jewel_id === value.master_jewel_id
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Item"
                            size="small"
                            sx={{ width: "150px", fontSize: "14px" }}
                          />
                        )}
                      />
                    
                     {/* wiring process after weight */}

                      <StyledTableCell >
                        <StyledInput
                          value={lotItem.data[2]?.ProcessSteps[1]?.AttributeValues[key].value}
                          placeholder="Weight"
                          onChange={(e) => { handleWiringProcess(lotItem.id, key, e.target.value,lotItem.data[2]?.ProcessSteps[1]?.AttributeInfo.attribute_id) }}
                          type="number" style={{ width: "120px" }} autoComplete="off"

                          inputRef={wiring(lotItem.id, 'wiringAfter')}
                          onKeyDown={(e) => handleKeyDown(e, lotItem.lotid, 'wiringAfter')}
                        />
                      </StyledTableCell>

                      {key === 0 && (
                        <>
                          {/* wiring process scarp weight */}
                          <StyledTableCell rowSpan={lotItem.data[2].ProcessSteps[1].AttributeValues.length}>

                            <StyledInput
                              value={
                                lotItem.data[2]?.ProcessSteps[2]?.AttributeValues[0]?.value
                              }
                              type="number" style={{ width: "120px" }} autoComplete="off"
                              onChange={(e) => { handleWiringProcess(lotItem.id, key, e.target.value,lotItem.data[2]?.ProcessSteps[2]?.AttributeInfo.attribute_id) }}
                              inputRef={wiring(lotItem.id, 'wiringScarp')}
                              onKeyDown={(e) => handleKeyDown(e, lotItem.lotid, 'wiringScarp')}
                            ></StyledInput>
                          </StyledTableCell>

                          {/* wiring process loss weight */}
                          <StyledTableCell rowSpan={lotItem.data[2].ProcessSteps[1].AttributeValues.length} style={{ borderRight: "3px solid black" }}>
                            <StyledInput
                              value={
                                typeof lotItem.data[2]?.ProcessSteps[3]?.AttributeValues[0]?.value === "number"
                                  ? lotItem.data[2].ProcessSteps[3].AttributeValues[0].value.toFixed(3)
                                  : ""
                              }
                            style={{ width: "120px" }} autoComplete="off"
                            ></StyledInput>
                          </StyledTableCell>
                        </>
                      )}
                      {/*Mechine Process to final Process */}

                       {
                        lotItem.data.map((lotProcess,lotArrIndex) => (
                        lotArrIndex >= 3 ? (
                            <React.Fragment key={lotArrIndex}>

                           {/* Other Process Before weights*/}
                              <StyledTableCell> 
                                <StyledInput
                                  value={
                                    typeof lotItem.data[lotArrIndex]?.ProcessSteps[0]?.AttributeValues[key]?.value === "number"
                                      ? lotItem.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value
                                      : ""
                                  }


                                  style={{ width: "120px" }}

                                ></StyledInput>
                              </StyledTableCell>
                               
                              {/* Other Process After weights*/}
                              <StyledTableCell>
                                <StyledInput
                                  value={lotItem.data[lotArrIndex]?.ProcessSteps[1]?.AttributeValues[key]?.value}
                                  onChange={(e) => {
                                    handleOtherProcess(
                                      lotItem.id,
                                      lotItem.date,
                                      lotItem.data[lotArrIndex]?.ProcessSteps[1]?.AttributeInfo.attribute_id,
                                      e.target.value,
                                      key,
                                      lotItem.data[lotArrIndex]?.ProcessSteps[1].process_id,
                                      lotArrIndex

                                    )
                                  }}
                                  type="number"
                                  style={{ width: "120px" }}
                                  autoComplete="off"
                                  inputRef={mechine(lotItem.id, lotItem.data[lotArrIndex]?.process_name + "After", key)}
                                  onKeyDown={(e) => handleKeyDown(e, lotItem.id, lotItem.data[lotArrIndex]?.process_name + "After", key)}
                                ></StyledInput>
                              </StyledTableCell>
                          {/* Other Process Scarp weights but Mechine and Cutting Process not have scrap weight*/}
                              {lotItem.data[lotArrIndex]?.process_name === "mechine" || lotItem.data[lotArrIndex]?.process_name === "cutting" ? 
                                null: (  
                                <StyledTableCell>
                                  <StyledInput
                                    value={lotItem.data[lotArrIndex]?.ProcessSteps[2]?.AttributeValues[key]?.value}
                                    onChange={(e) => {
                                      handleOtherProcess(
                                        lotItem.id,
                                        lotItem.date,
                                        lotItem.data[lotArrIndex]?.ProcessSteps[2]?.AttributeInfo.attribute_id,
                                        e.target.value, key,
                                        lotItem.data[lotArrIndex]?.ProcessSteps[2].process_id,
                                        lotArrIndex

                                      )
                                    }}
                                    type="number"
                                    style={{ width: "120px" }}
                                    autoComplete="off"
                                    inputRef={mechine(lotItem.id, lotItem.data[lotArrIndex]?.process_name + "Scarp", key)}
                                    onKeyDown={(e) => handleKeyDown(e, lotItem.id, lotItem.data[lotArrIndex]?.process_name + "Scarp", key)}
                                  ></StyledInput>
                                </StyledTableCell>)
                                }
                               
                               {/*Other process loss weights should be stored in position 3, and machine and cutting process weights should be stored in position 2*/}
                              <StyledTableCell style={{ borderRight: lotItem.data[lotArrIndex]?.process_name === "cutting" ? "none" : "3px solid black" }}>
                                {lotItem.data[lotArrIndex]?.process_name === "mechine" || lotItem.data[lotArrIndex]?.process_name === "cutting"? (
                                  <StyledInput
                                    value={
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[2]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                    style={{ width: "120px" }}

                                  />) : (<StyledInput 
                                    value={
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[3]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                    style={{ width: "120px" }}

                                  />)}

                              </StyledTableCell>
                               
                               {/* Cutting process only have pure weight */}
                              {lotArrIndex === 6 ? (
                                <StyledTableCell style={{ borderRight: "3px solid black" }}>
                                  <StyledInput
                                    value={
                                      typeof lotItem.data[lotArrIndex]?.ProcessSteps[3]?.AttributeValues[key]?.value === "number"
                                        ? lotItem.data[lotArrIndex]?.ProcessSteps[3].AttributeValues[key].value.toFixed(3)
                                        : ""
                                    }
                                    style={{ width: "120px" }}

                                  ></StyledInput>
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
                          <StyledTableCell colSpan={12}></StyledTableCell>
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
                                  onChange={(e) => {
                                    handleMechineScarp(
                                      Number(e.target.value),   
                                      lotItem?.scarpInfo?.createdAt
                                    );
                                  }}
                                   label="Scarp" 
                                   type="number" 
                                  
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
                                type="number"
                                onChange={(e) => {
                                  handleCuttingScarp(
                                   Number(e.target.value),
                                    lotItem?.scarpInfo?.createdAt,
                                    "scarp"
                                  );
                                }}
                                // inputRef={cuttingBox(
                                //   `${lotItem.scarpBox[1].cutting?.lot_id}_${lotItem.scarpBox[1].cutting?.scarpDate}`,
                                //   "cuttingBoxScarp",
                                // )}
                                // onKeyDown={(e) =>
                                //   handleKeyCutting(
                                //     e,
                                //     `${lotItem.scarpBox[1].cutting?.lot_id}_${lotItem.scarpBox[1].cutting?.scarpDate}`,
                                //     "cuttingBoxScarp",
                                //   )
                                // }
                                autoComplete="off"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                value={Number(lotItem?.scarpInfo?.touch[1].value) || ""}
                                label="Giventouch"
                                type="number"
                                onChange={(e) => {
                                  handleCuttingScarp(
                                  Number(  e.target.value),
                                    lotItem?.scarpInfo?.createdAt,
                                    "touch",
                                  );
                                }}
                                // inputRef={cuttingBox(
                                //   `${lotItem.scarpBox[1].cutting?.lot_id}_${lotItem.scarpBox[1].cutting?.scarpDate}`,
                                //   "cuttingBoxTouch",
                                // )}
                                // onKeyDown={(e) =>
                                //   handleKeyCutting(
                                //     e,
                                //     `${lotItem.scarpBox[1].cutting?.lot_id}_${lotItem.scarpBox[1].cutting?.scarpDate}`,
                                //     "cuttingBoxTouch",
                                //   )
                                // }
                                autoComplete="off"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                value={
                                Number((lotItem?.scarpInfo?.cuttingScarp[1].value).toFixed(3))
                                }
                                label="GivenScarpPure"
                                type="number"
                                autoComplete="off"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="BalanceScarpPure"
                                value={(lotItem?.scarpInfo?.totalScarp[1]?.value).toFixed(
                                  3,
                                )}
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
            
            </TableBody> 
            <LotTableFooter calculation={calculation}/>
          </Table>
          <ToastContainer />
        </div>
      </StyledTableContainer>
      {/* <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
        Download as PDF
      </Button>
      <Button variant="contained" onClick={exportToExcel} style={{ marginLeft: '1rem' }}>Excel</Button> */}

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Enter Initial Weight
          </Typography>
          <TextField
            fullWidth
            label="Initial Weight"
            value={initialWeight}
            onChange={(e) => setInitialWeight(e.target.value)}
            autoComplete="off"
            sx={{ mt: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                touchRef.current.focus()
              }
            }}
          />
          <Typography variant="h6" component="h2">
            Touch Weight
          </Typography>
          <TextField
            fullWidth
            label="Touch Weight"
            value={touchValue}
            onChange={(e) => setTouchValue(e.target.value)}
            sx={{ mt: 2 }}
            autoComplete="off"
            inputRef={touchRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveRef.current.focus()
              }
            }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave} ref={saveRef} >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>

  );
};

export default ProcessTable;









