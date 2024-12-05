
function formatDateForDB(date) {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().slice(0, 19).replace('T', ' ') + 
           '.' + adjustedDate.getMilliseconds().toString().padStart(3, '0') + 
           (offset > 0 ? '-' : '+') + 
           Math.abs(offset/60).toString().padStart(2, '0');
  }

  export default formatDateForDB