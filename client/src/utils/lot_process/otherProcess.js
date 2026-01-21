const handleOtherProcessAfterWeight = (lotData,lotArrIndex,key,value,process_id) => {
  
  lotData.data[lotArrIndex].ProcessSteps[1].AttributeValues[key].value =parseFloat(value);
  // lotData.data[lotArrIndex].ProcessSteps[1].AttributeValues[key].index = key
  
  if (process_id === 4 || process_id === 7) {
   
    if (process_id === 7) {
      //Pure Weight Calculation
      lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value =lotData.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value -parseFloat(value);
      // lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].index = key
      lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].value =(lotData.data[0].ProcessSteps[0].AttributeValues[0].touchValue *lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value) /100;
      // lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].index = key
      //  handleScarpBoxTotal(lotDate,process_id)
    } else {
      lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value =lotData.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value -lotData.data[lotArrIndex].ProcessSteps[1].AttributeValues[key].value;
      // lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].index = key
      // handleScarpBoxTotal(lotDate,process_id)// calculate totalScarp
    }
  } else {
      lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].value = lotData.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value -lotData.data[lotArrIndex].ProcessSteps[1].AttributeValues[key].value;
    // lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].index = key
  }
  //Before weight carryForward
  if (process_id < 8) {
    lotData.data[lotArrIndex + 1].ProcessSteps[0].AttributeValues[key].value =
      parseFloat(value);
    // lotData.data[lotArrIndex + 1].ProcessSteps[0].AttributeValues[key].index = key
  }
  return lotData
};

const handleOtherProcessScrapWeight = (lotData, lotArrIndex, key, value) => {
  lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].value =parseFloat(value);
    // lotData.data[lotArrIndex].ProcessSteps[2].AttributeValues[key].index = key;
  lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].value = lotData.data[lotArrIndex].ProcessSteps[0].AttributeValues[key].value -lotData.data[lotArrIndex].ProcessSteps[1].AttributeValues[key].value -value;
    // lotData.data[lotArrIndex].ProcessSteps[3].AttributeValues[key].index = key;
    return lotData;
};
 
export default {
  handleOtherProcessAfterWeight,
  handleOtherProcessScrapWeight,
};
