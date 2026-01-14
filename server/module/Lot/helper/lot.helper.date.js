const getTodayRange = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  return { today, end };
};

module.exports={getTodayRange}
