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
  
    const {lotResponse} = await getAllLotService()
   
    res.status(200).json({
      message: "fetched all Lots",
      status: "ok",
      data:lotResponse,
     
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

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: 'fromDate and toDate are required' });
    }
      if (fromDate>toDate) {
      return res.status(400).json({ error: 'Give Correct Date Formate' });
    }
     const startDate = new Date(`${fromDate}T00:00:00.000Z`);
     const endDate = new Date(`${toDate}T23:59:59.999Z`);
     const clubbedResponse= await getLotsByDateRangeService(startDate,endDate)
     
     return res.status(200).json({
       message: "fetched all Lots",
       status: "ok",
       data:clubbedResponse
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



