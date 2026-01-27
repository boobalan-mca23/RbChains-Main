const { PrismaClient,PRODUCT_STATUS} = require("@prisma/client");
const prisma = new PrismaClient();

exports.otherProcess = async (itemIds, item) => {
  const itemIdArr = itemIds;

  return await prisma.$transaction(async (tx) => {
    if (!item?.AttributeValues?.length) return null;

    for (let index = 0; index < item.AttributeValues.length; index++) {
      const attr = item.AttributeValues[index];

      if (attr.id) {
         // Prevent duplicate product stock creation by checking existing stock.
         // Only create stock when processing is completed (process_step_id = 26)
         // and the final output value is available.

             const existStock=await tx.productStocks.findFirst({
                 where:{
                    item_id:attr.item_id
                 }
             })
             if(!existStock){
            if(attr.process_step_id===26 && attr.value!=null){

                     await tx.productStocks.create({
                        data:{
                           item_id:attr.items_id,
                           product_status:PRODUCT_STATUS.ACTIVE
                     }
                })
            } 
            
             }
            // and update the attribute values
        await tx.attributeValue.update({
          where: { id: attr.id },
          data: attr,
        });

      } else {
        const obj = {
          process_step_id: attr.process_step_id,
          lot_id: attr.lot_id,
          attribute_id: attr.attribute_id,
          item_name: attr.item_name,
          items_id: itemIdArr[index],
          value: attr.value === null ? null : parseFloat(attr.value),
          touchValue: attr.touchValue ? parseFloat(attr.touchValue) : null,
        };
       // create new attribute values.

        await tx.attributeValue.create({
          data: obj,
        });
        // Create product stock entry when the item reaches the final process step
        // (process_step_id = 26) and a valid output value is available
        if(obj.process_step_id===26 && obj.value!=null){

                 await tx.productStocks.create({
                     data:{
                        item_id:itemIdArr[index],
                        product_status:PRODUCT_STATUS.ACTIVE
                     }
                 })
        }
      }
    }
  });
};



 
