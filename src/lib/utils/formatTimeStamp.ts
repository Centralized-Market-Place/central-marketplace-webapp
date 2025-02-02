function formatTimestamp(timestamp: string | number | Date): string {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
    const isSameYear = date.getFullYear() === new Date().getFullYear();
  
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  
    const isSameWeek = date >= startOfWeek;
  
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleTimeString('en-US', options);
  
    if (isToday) {
      return `Today ${timeString}`;
    }
  
    if (isYesterday) {
      return `Yesterday ${timeString}`;
    }
  
    if (isSameWeek) {
      return `${date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}, ${timeString}`;
    }
  
    if (isSameYear) {
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${timeString}`;
    }
  
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${timeString}`;
  }
  
export default formatTimestamp;