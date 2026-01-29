 
const handleScarpItemTotal = (date, tempRes) => {
    //add total items
    let totalItem = 0;
    let filteredLot = tempRes.filter((item,_) => item.date?.split("T")[0] === date?.split("T")[0]);
    for (const lot of filteredLot) {
      totalItem += lot.data[3].ProcessSteps[0].AttributeValues.length;
    }
    return totalItem;
  };

 const handleLotChildItem = (response) => {
 
  const tempRes = response;
    let item_Total = 0;
    for (const res of tempRes) {
      if (res.scarpInfo) {
        item_Total = handleScarpItemTotal(
          res.scarpInfo.createdAt,
          tempRes,
        );
        res.scarpInfo.itemTotal[0].value= item_Total;
        res.scarpInfo.itemTotal[1].value= item_Total;
        item_Total = 0;
      }
    }
   return tempRes

};

export default handleLotChildItem