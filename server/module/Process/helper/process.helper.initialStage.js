
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.initialStage = async (stepItem) => {
  
  if(stepItem.AttributeValues.length>=1){
     stepItem.AttributeValues.map(async(attr,_)=>{
           if(attr.id){

          await prisma.attributeValue.update(({
             where:{
                id:attr.id
             },
             data:attr
          }))
      }else{
         await prisma.attributeValue.create({
             data:{
                 process_step_id: attr.process_step_id,
                 lot_id: attr.lot_id,
                 attribute_id: attr.attribute_id,
                 items_id: attr.item_id,
                 item_name: attr.item_name,
                 value: attr.value === null ? null : parseFloat(attr.value),
                 touchValue: attr.touchValue ? parseFloat(attr.touchValue) : null
             }
         })
      }

     })
  }
  
};
