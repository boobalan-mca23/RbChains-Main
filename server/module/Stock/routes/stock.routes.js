const express = require('express');
const router=express.Router()

const stock =require('../controllers/stock.controller')

router.get('/getStock',stock.stockWithStatus)
module.exports=router
