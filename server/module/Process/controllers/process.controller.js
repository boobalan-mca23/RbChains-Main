const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const {getAll_lotProcess_Service}=require('../services/process.services');
const {initialStage} =require('../helper/process.helper.initialStage')
const {wiringStage}=require('../helper/process.helper.wiring')
const {otherProcess}=require('../helper/process.helper.otherProcess')

const getlotProcessesById = async (req, res) => {
  try {
    console.log("Fetching all processes...");
    const { lot_id } = req.params;

    const lotExists = await prisma.lotInfo.findFirst({
      where: { id: Number(lot_id) },
    });

    if (!lotExists) {
      return res.status(404).json({ message: "Lot does not exist" });
    }
    // ✅ First, get all process step IDs
    const processStepIds = await prisma.processSteps.findMany({
      select: { id: true }
    });

    const stepIds = processStepIds.map(step => step.id); // Extract IDs

    //  Now, fetch LotProcess with nested relations
    const processes = await prisma.lotProcess.findMany({
      include: {
        ProcessSteps: {
          include: {
            AttributeInfo: true,
            AttributeValues: {
              where: {
                lot_id: Number(lot_id),
                process_step_id: { in: stepIds } // ✅ Correctly filter step IDs
              }
            }
          }
        }
      }
    });

    console.log("Processes fetched successfully:", JSON.stringify(processes, null, 2));
    res.json(processes);
  } catch (error) {
    console.error("Error fetching processes:", error);
    res.status(500).json({ error: "Failed to fetch processes" });
  }
};

//create process for each attribute values
const saveProcess = async (req, res) => {
  

  try {
   

    const lotData = req.body.lotdata

    if (!req.body.lotdata) {
      return res.status(400).json({ status: 'noData', message: "No Lot Data" });
    }
    
  async function process(){
   for (const lot of lotData) {


         if (lot?.data) {
                for (const process of lot.data) {
                  const { ProcessSteps } = process;

                  for (const item of ProcessSteps) {

                    // Initial stages
                    if (item.id >= 1 && item.id <= 6) {
                      await initialStage(item);
                    } 
                    else {
                      if (item.process_id === 3) {

                        //  wiring stage
                        if (item.id === 7) {
                         try{
                            await wiringStage(item); 
                           
                         }catch(err){
                                if (err.code === "NO_MASTER_ID") {
                                        throw {
                                    status: 400,
                                    statusMsg: "noMasterId",
                                    message: err.message,
                                  }; }
                              throw err
                         }
                          
                        }else{
                          // wiring scarp and loss weight 
                           await wiringStage(item); 
                        }

                      } else {
                        // otherProcess 
                        // in other process time we need to refer item id 
                        await otherProcess(item) 
                        
                      }
                    }
                  }
                }
              } else {
                   
             // in this code we need to the scarp box informations
              await prisma.scarpInfo.update({
               where: { id: lot.scarpInfo.id },
                  data: {
                        itemTotal: lot.scarpInfo.itemTotal ?? [] ,
                        scarp:   lot.scarpInfo.scarp ?? [] ,
                        touch:   lot.scarpInfo.touch ?? [] ,
                        cuttingScarp:  lot.scarpInfo.cuttingScarp ?? [] ,
                        totalScarp:  lot.scarpInfo.totalScarp ?? []
                  }
            });

                
              }
              }

  }
  process()

     return res.status(200).json({
      status: "ok",
      message: "Process saved successfully",
    });
    
  } catch (error) {
    
    console.error("Error creating process:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};




const getAllProcess=async(req,res)=>{
     try{
         const allProcess=await getAll_lotProcess_Service()
         
         return res.status(200).json({
                 message: "fetched all Lot Process",
                 status: "ok",
                 data:allProcess,
         })

     }catch(err){
       console.error("Error fetching lot Process:", err.message);
       res.status(500).json({ error: err.message });  
     }
}

module.exports = {
  getlotProcessesById,
  saveProcess,
  getAllProcess


};

