import dayjs from "dayjs";

export function generateDatesFromMonthBeginning(){
  const firstDayOfTheMonth = dayjs().startOf('month')
  const today = new Date()

  const firstDayOfWeek = firstDayOfTheMonth.day();

  const dates = []

  for (let i = 0; i < firstDayOfWeek; i++) {
    dates.push(null);
  }
  
  let compareDate = firstDayOfTheMonth

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate())
    compareDate = compareDate.add(1, 'day')
  }

  return dates
}