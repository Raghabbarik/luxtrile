export const formatDate = (date, format = 'DD MMM YYYY') => {
  const d = new Date(date);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  if (format === 'DD MMM YYYY') {
    return `${day} ${month} ${year}`;
  }

  if (format === 'DD/MM/YYYY') {
    return `${day}/${d.getMonth() + 1}/${year}`;
  }

  return d.toLocaleDateString();
};

export const formatTime = time => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getDayName = date => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[new Date(date).getDay()];
};

export const isToday = date => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const isTomorrow = date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkDate = new Date(date);
  return (
    tomorrow.getDate() === checkDate.getDate() &&
    tomorrow.getMonth() === checkDate.getMonth() &&
    tomorrow.getFullYear() === checkDate.getFullYear()
  );
};

export const getRelativeDate = date => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return formatDate(date);
};
