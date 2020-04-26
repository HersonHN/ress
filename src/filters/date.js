import fromNow from 'from-now';

export default function (isoDate) {
  if (!isoDate) return '';

  let date = Date.parse(isoDate);
  let now = Date.now();
  let diff = now - (+date);
  if (diff < 0) {
    // In case the date is wrong and set in the future
    // iso date comes in UTC timezone
    return '';
  }
  return fromNow(date);
}
