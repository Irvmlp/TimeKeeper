export const getWeekIdentifier = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  
    const year = startOfWeek.getFullYear();
    const weekNumber = Math.ceil((((startOfWeek - new Date(year, 0, 1)) / 86400000) + startOfWeek.getDay() + 1) / 7);
  
    return `${year}-W${weekNumber}`;
  };
  
  export const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return startOfWeek;
  };
  
  export const getEndOfWeek = (date) => {
    const endOfWeek = new Date(date);
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    return endOfWeek;
  };
  