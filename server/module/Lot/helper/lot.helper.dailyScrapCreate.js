const { PrismaClient} = require('@prisma/client')
const prisma=new PrismaClient()


let items = [
  { processId: 3, value: 0 },
  { processId: 6, value: 0 },
];

const dailyScarpCreate = async (newLotId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today's scarp exists
    let scarp = await prisma.scarpInfo.findFirst({
        where: {
        createdAt: {
            gte: today, // check today only
        },
        },
    });

    // If no scarp for today — create new row
    if (!scarp) {
        scarp = await prisma.scarpInfo.create({
        data: {
           
            lot_ids: [newLotId],     // NEW lot added here
            process_ids: [3, 6],     // initial process ids

            itemTotal: items,
            scarp: items,
            touch: items,
            cuttingScarp: items,
            totalScarp: items,
        },
        });

        console.log("Created new scarp row for today:", scarp);
        return scarp;
    }

    //  If today already exists — update lot list
    let updatedLotIds = scarp.lot_ids || [];

    // Only push if not already added
    if (!updatedLotIds.includes(newLotId)) {
        updatedLotIds.push(newLotId);
    }

    scarp = await prisma.scarpInfo.update({
        where: { id: scarp.id },
        data: {
        lot_ids: updatedLotIds,
        },
    });

    console.log("Updated existing scarp row:", scarp);
    
    };
module.exports={dailyScarpCreate}