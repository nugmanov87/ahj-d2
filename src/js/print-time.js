export default function printTime(valueDate) {
  function formatTime(value) {
    const rValue = value < 10 ? `0${value}` : value;
    return rValue;
  }
  const itemDate = new Date(valueDate);
  const date = formatTime(itemDate.getDate());
  const month = formatTime(itemDate.getMonth() + 1);
  const year = formatTime(itemDate.getFullYear());
  const hours = formatTime(itemDate.getHours());
  const minut = formatTime(itemDate.getMinutes());
  const itemCreated = `${hours}:${minut} ${date}.${month}.${year}`;
  return itemCreated;
}
