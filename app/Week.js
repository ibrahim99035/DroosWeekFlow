function calculateWeekend(lastOrder) {
    let newOrder;
    if (lastOrder == 56){
        newOrder = 1;
    } else{
        newOrder = lastOrder + 1;
    }
    // Get the current date
    let firstDate = new Date();
  
    // Check if today is not Saturday
    if (firstDate.getDay() !== 6) {
      // Calculate the difference between the current day and the next Saturday
      let difference = (6 - firstDate.getDay() + 7) % 7;
  
      // Add the difference to get the date of next Saturday
      firstDate.setDate(firstDate.getDate() + difference);
    }
  
    // Get the date of next Friday
    let lastDate = new Date(firstDate);
    lastDate.setDate(lastDate.getDate() + 6); // Adding 6 to get to next Friday
    const start = firstDate.toISOString().slice(0, 10);
    const end = lastDate.toISOString().slice(0, 10); 
    return { start, end, newOrder };
}

module.exports = { calculateWeekend };