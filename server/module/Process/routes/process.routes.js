
const express = require("express");
const router = express.Router();

const {getlotProcessesById,saveProcess,getAllProcess} = require("../controllers/process.controller");

router.get("/",getAllProcess);

router.get("/processes/:lot_id",getlotProcessesById);


router.post("/saveProcess", saveProcess);






module.exports = router;
