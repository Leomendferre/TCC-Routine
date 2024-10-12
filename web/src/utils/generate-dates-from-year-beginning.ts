import dayjs from "dayjs";

// Função para gerar as datas desde o início do ano até o dia atual
export function generateDatesFromYearBeginning() {
  const firstDayOfTheYear = dayjs().startOf("year");
  const today = dayjs();

  const dates = [];
  let compareDate = firstDayOfTheYear;

  while (compareDate.isBefore(today) || compareDate.isSame(today)) {
    dates.push(compareDate.toDate());
    compareDate = compareDate.add(1, "day");
  }

  return dates;
}

export function getReorderedWeekDays() {
  const firstDayOfTheWeek = dayjs().startOf("week").day();
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const reorderedWeekDays = [
    ...weekDays.slice(firstDayOfTheWeek),
    ...weekDays.slice(0, firstDayOfTheWeek),
  ];

  return reorderedWeekDays;
}
