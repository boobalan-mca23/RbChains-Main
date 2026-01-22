 const getItemTotalByDate = (lots) => {
    console.log('lots',lots)
  return lots.reduce((acc, lot) => {
    const date = lot.date;
   
    const count =
      lot.data?.[3]?.ProcessSteps?.[0]?.AttributeValues?.length || 0;

    acc[date] = (acc[date] || 0) + count;
    return acc;
  }, {});
};


 const handleLotChildItem = (response) => {
  const itemTotalByDate = getItemTotalByDate(response);
 
  return response.map(lot => {
    if (!lot.scarpInfo) return lot;

    const total = itemTotalByDate[lot.date] || {};
   console.log('total',total)
    // return {
    //   ...lot,
    //   scarpInfo: {
    //     ...lot.scarpInfo,
    //     itemTotal: lot.scarpInfo.itemTotal.map(item => ({
    //       ...item,
    //       value: 
    //     }))
    //   }
    // };
  });
};

export default handleLotChildItem