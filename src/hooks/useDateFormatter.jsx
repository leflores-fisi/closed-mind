
const useDateFormatter = (date) => {

  console.log('Formatting', date);
  if (!date) return '??:??';

  let d = new Date(date);
  
  let hour = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
  let minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  
  return `${hour.replace(/ PM| AM/, '')}:${minute}`;
}
export default useDateFormatter;