const createAttributeObj=(lotdata,lotid,processIndex,stepIndex,value)=>{
 
    const step = lotdata.data[processIndex].ProcessSteps[stepIndex];
   return{
               lot_id:lotid,
               item_id:lotdata?.data[0].ProcessSteps[0].AttributeValues[0].items_id,
               attribute_id:step.attribute_id,
               process_step_id:step.id,
               master_jewel_id:null,
               item_name:null,
               index:null,
               touchValue:null,
               value:parseFloat(value)
   }
               
}


 const updateMeltingAfter=(lotdata,lotid,value)=>{

    if(lotdata?.data[1]?.ProcessSteps[1]?.AttributeValues.length===0){

            let obj=createAttributeObj(lotdata,lotid,1,1,value)
            let nextObj=createAttributeObj(lotdata,lotid,2,0,value) 
            let lossObj=createAttributeObj(lotdata,lotid,1,3,value)  

        lotdata?.data[1]?.ProcessSteps[1]?.AttributeValues.push(obj)
        lotdata?.data[2]?.ProcessSteps[0]?.AttributeValues.push(nextObj)
        lossObj.value=lotdata.data[1].ProcessSteps[0].AttributeValues.length === 1 && lotdata?.data[1].ProcessSteps[1].AttributeValues.length === 1 ? (lotdata?.data[1].ProcessSteps[0].AttributeValues[0].value - lotdata?.data[1].ProcessSteps[1].AttributeValues[0].value) : 0
        lotdata?.data[1]?.ProcessSteps[3]?.AttributeValues.push(lossObj)

    }else{
      // just update the value no create new object for after weight before weight and loss weight
        lotdata.data[1].ProcessSteps[1].AttributeValues[0].value=parseFloat(value)
        lotdata.data[2].ProcessSteps[0].AttributeValues[0].value=parseFloat(value)
        lotdata.data[1].ProcessSteps[3].AttributeValues[0].value=lotdata.data[1]?.ProcessSteps[0]?.AttributeValues.length === 1 && lotdata?.data[1]?.ProcessSteps[1]?.AttributeValues.length === 1 ? (lotdata?.data[1]?.ProcessSteps[0]?.AttributeValues[0]?.value - lotdata?.data[1]?.ProcessSteps[1]?.AttributeValues[0].value) : 0
        
    }
      return lotdata
    }
    const updateMeltingScarp=(lotdata,lotid,value)=>{
      

        if(lotdata?.data[1]?.ProcessSteps[2]?.AttributeValues.length===0){

            let obj=createAttributeObj(lotdata,lotid,1,2,value)
            lotdata?.data[1]?.ProcessSteps[2]?.AttributeValues.push(obj)
            lotdata.data[1].ProcessSteps[3].AttributeValues[0].value=lotdata.data[1].ProcessSteps[0].AttributeValues.length === 1 && lotdata.data[1].ProcessSteps[1].AttributeValues.length === 1 ? (lotdata.data[1].ProcessSteps[0].AttributeValues[0].value - lotdata.data[1].ProcessSteps[1].AttributeValues[0].value) - parseFloat(value) : 0
      }
      else{
      // just update the value no create new object for scarp weight and loss weight
        lotdata.data[1].ProcessSteps[2].AttributeValues[0].value=parseFloat(value)
        lotdata.data[1].ProcessSteps[3].AttributeValues[0].value=lotdata.data[1].ProcessSteps[0].AttributeValues.length === 1 && lotdata.data[1].ProcessSteps[1].AttributeValues.length === 1 ? (lotdata.data[1].ProcessSteps[0].AttributeValues[0].value - lotdata.data[1].ProcessSteps[1].AttributeValues[0].value) - parseFloat(value) : 0
        
    }
      return lotdata
    }

export default {updateMeltingAfter,updateMeltingScarp}