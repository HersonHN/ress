import fromNow from 'from-now';

export default function (isoDate: string) {
  if (!isoDate) return '';

  const date = Date.parse(isoDate);
  const now = Date.now();
  const diff = now - date;
  if (diff < 0) {
    // In case the date is wrong and set in the future
    // iso date comes in UTC timezone
    return '';
  }
  return String(fromNow(date));
}
