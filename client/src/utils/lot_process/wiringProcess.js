

const wiringAfterTotal = (lotData) => {
  const attributeValues =
    lotData.data[2].ProcessSteps[1].AttributeValues;

  const afterTotal = attributeValues.reduce((total, item) => {
    return total + (item?.value || 0);
  }, 0);

  return afterTotal;
};


const updateWiringAfter=(lotData,childIndex,itemWeight)=>{
     lotData.data[2].ProcessSteps[1].AttributeValues[childIndex].value = parseFloat(itemWeight);
      // lotData[0].data[2].ProcessSteps[1].AttributeValues[childIndex].index = childIndex
    
      //Loss
      lotData.data[2].ProcessSteps[3].AttributeValues[0].value =lotData.data[2].ProcessSteps[0].AttributeValues.length===1? lotData.data[2].ProcessSteps[0].AttributeValues[0].value - wiringAfterTotal(lotData):0-wiringAfterTotal(lotData)
      // lotData[0].data[2].ProcessSteps[3].AttributeValues[0].index = childIndex
     
     
      // next process before 
      lotData.data[3].ProcessSteps[0].AttributeValues[childIndex].value = parseFloat(itemWeight);
      // lotData[0].data[3].ProcessSteps[0].AttributeValues[childIndex].index = childIndex
      return lotData
}

const updateWiringScarp=(lotData,childIndex,itemWeight)=>{
      lotData.data[2].ProcessSteps[2].AttributeValues[0].value = parseFloat(itemWeight);
      // lotData[0].data[2].ProcessSteps[2].AttributeValues[childIndex].index = childIndex
   
      lotData.data[2].ProcessSteps[3].AttributeValues[0].value = lotData.data[2].ProcessSteps[0].AttributeValues.length===1 ?(lotData.data[2].ProcessSteps[0].AttributeValues[0].value - wiringAfterTotal(lotData)) - parseFloat(itemWeight):0
      return lotData
}

export default {updateWiringAfter,updateWiringScarp}

