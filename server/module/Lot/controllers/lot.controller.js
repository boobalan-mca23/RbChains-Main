

const { createLotService ,getAllLotService} = require("../services/lot.services");

exports.createLotInfo = async (req, res) => {
  try {
    const { initialWeight, touchValue } = req.body;

    if (!initialWeight || !touchValue) {
      return res.status(400).json({
        message: "Initial weight & touch value are required"
      });
    }

    const {finalData} = await createLotService(initialWeight, touchValue);

    return res.status(201).json({
      message: "New Lot Created",
      status: "ok",
      data:finalData,
    });

  } catch (error) {
    console.error("Create lot error:", error);
    return res.status(500).json({
      message: "Failed to create lot",
      error: error.message,
    });
  }
};


exports.getAllLots = async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1
    const limit= parseInt(req.query.limit) || 2;

    const {finalData,totalCount} = await getAllLotService(page,limit)
   
    res.status(200).json({
      message: "fetched all Lots",
      status: "ok",
      totalCount,
      totalPage:Math.ceil(totalCount/limit),
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



