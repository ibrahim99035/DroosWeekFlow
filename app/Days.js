function getDaysOfWeek(startDate) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const result = [];
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    result.push({
      day: daysOfWeek[currentDate.getDay()],
      date: currentDate.toISOString().slice(0, 10)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

module.exports = { getDaysOfWeek };