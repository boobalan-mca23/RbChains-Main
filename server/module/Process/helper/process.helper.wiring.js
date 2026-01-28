const { PrismaClient,PRODUCT_TYPE } = require("@prisma/client");
const prisma = new PrismaClient();
 
exports.wiringStage = async (stepItem) => {
  return await prisma.$transaction(async (tx) => {


    if (!stepItem?.AttributeValues?.length) return null;

    for (const attr of stepItem.AttributeValues) {

      //  Validation
      if(!attr.id){
         // master jewel id check only for new item
         if (attr.process_step_id === 7 && !attr.master_jewel_id) {
         const err = new Error("JewelName is Required");
         err.code = "NO_MASTER_ID";
         throw err;
      }

      }

      if (attr.id) {
       // in this time we need to update the masterJewel id also

      if(attr.master_jewel_id && attr.process_step_id === 7){
         await tx.masterJewelItemMapper.update(
         {
          where:{item_id:attr.items_id},
          data:{master_jewel_id:attr.master_jewel_id}
        })
      }
       // and update the attribute values
        await tx.attributeValue.update({
          where: { id: attr.id },
          data: {
             process_step_id: attr.process_step_id,
             lot_id: attr.lot_id,
             attribute_id: attr.attribute_id,
             item_name: attr.item_name,
             value: attr.value === null ? null : parseFloat(attr.value),
             touchValue: attr.touchValue ? parseFloat(attr.touchValue) : null,
          },
        });
      } else {
        const obj = {
          process_step_id: attr.process_step_id,
          lot_id: attr.lot_id,
          attribute_id: attr.attribute_id,
          item_name: attr.item_name,
          value: attr.value === null ? null : parseFloat(attr.value),
          touchValue: attr.touchValue ? parseFloat(attr.touchValue) : null,
        };

        if (obj.process_step_id === 7) {
          await tx.item.create({
            data: {
              lot_id: obj.lot_id,
              item_type: PRODUCT_TYPE.CHILD,

              AttributeValues: {
                create: obj,
              },

              MasterJewelItemMapper: {
                create: {
                  master_jewel_id: attr.master_jewel_id,
                },
               },
            },
          });
         
        } else {
          // in this area we need to create wiring scarp box and loss
          await tx.attributeValue.create({ data: obj });
        }
      }
    }
  });
};
