

const { json } = require("body-parser");
const { createLotService ,getAllLotService,getLotsByDateRangeService} = require("../services/lot.services");
// create new lot
exports.createLotInfo = async (req, res) => {
  try {
    const { initialWeight, touchValue } = req.body;

    if (!initialWeight || !touchValue) {
      return res.status(400).json({
        message: "Initial weight & touch value are required"
      });
    }

    await createLotService(initialWeight, touchValue);

    return res.status(201).json({
      message: "New Lot Created",
      status: "ok",
    });

  } catch (error) {
    console.error("Create lot error:", error);
    return res.status(500).json({
      message: "Failed to create lot",
      error: error.message,
    });
  }
};

// get today lot information
exports.getAllLots = async (req, res) => {
  try {
  
    const {finalData} = await getAllLotService()
   
    res.status(200).json({
      message: "fetched all Lots",
      status: "ok",
      data:finalData,
     
    })

  } catch (error) {
  
    console.error("Fetch All lot error:", error);
    return res.status(500).json({
      message: "Failed Fetch All lot",
      error: error.message,
    });

  }
};
// filter lot information with date

exports.getLotsByDateRange=async(req,res)=>{
   try{
      const {fromDate,toDate}=req.query
      const finalData=await getLotsByDateRangeService(fromDate,toDate)
      console.log(finalData)
     return res.status(200).json({
       message: "fetched all Lots",
       status: "ok",
       data:finalData
     })

   }
   catch(err){
      console.error("Fetch Date Wise lot error:", err);
     return res.status(500).json({
      message: "Failed Fetch Date Wise lot error",
      error: err.message,
    });
   }
}



