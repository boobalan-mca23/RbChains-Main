
const { PrismaClient, PRODUCT_TYPE } = require("@prisma/client");
const prisma = new PrismaClient();

const { generateLotName } = require("../helper/lot.helper.lotName");
const { getTodayRange } = require("../helper/lot.helper.date");
const { dailyScarpCreate } = require("../helper/lot.helper.dailyScrapCreate");
const { today, end } = getTodayRange();

exports.createLotService = async (initialWeight, touchValue) => {
  //  Create Lot
  const newLot = await prisma.lotInfo.create({
    data: { lotName: generateLotName() }
  });

  // Create scarp info entry for this lot
  await dailyScarpCreate(newLot.id);

  // Insert initial item weights
  await prisma.item.create({
    data: {
      lot_id: newLot.id,
      item_type: PRODUCT_TYPE.PARENT,
      AttributeValues: {
        create: [
          {
            lot_id: newLot.id,
            attribute_id: 1,
            value: parseFloat(initialWeight),
            touchValue: parseFloat(touchValue),
            process_step_id: 1,
          },
          {
            lot_id: newLot.id,
            attribute_id: 2,
            value: parseFloat(initialWeight),
            process_step_id: 2,
          }
        ]
      }
    }
  });


};


exports.getAllLotService=async(page,limit)=>{

   const todayLots = await prisma.lotInfo.findMany({
              where:{ createdAt:{ gte:today, lte:end} },
        });

  const stepIds = (await prisma.processSteps.findMany()).map(s => s.id);

    const finalData = await Promise.all(
      todayLots.map(async (item) => {
        const lotInfo = await prisma.lotProcess.findMany({
          include: {
            ProcessSteps: {
              include: {
                AttributeInfo: true,
                AttributeValues: {
                  where: {
                    lot_id: item.id,
                    process_step_id: { in: stepIds }
                  }
                }
              }
            }
          }
        });

        return {
          id: item.id,
          data: lotInfo,
          date: item.createdAt
        };
      })
    );
    const scarpData = await prisma.scarpInfo.findFirst({
      where: { createdAt: { gte: today, lte: end } }
    });
      

    return {
       finalData:[...finalData,{scarpInfo:scarpData}]||[],
      
    }
}

