import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning, getReorderedWeekDays } from "../utils/generate-dates-from-year-beginning";
import dayjs from "dayjs";
import { RoutineDay } from "./RoutineDay";

import { Header } from "./Header";



const groupDatesByMonth = (dates: Date[]) => {
  return dates.reduce((acc: Record<string, Date[]>, date: Date) => {
    const month = dayjs(date).format("MMMM - YYYY"); 
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(date);
    return acc;
  }, {});
};

const groupDatesByWeek = (dates: Date[]) => {
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];


  const firstDayOfMonth = dayjs(dates[0]);
  const firstDayOfWeek = firstDayOfMonth.day();


  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  dates.forEach((date) => {
    const dayOfWeek = dayjs(date).day();

    currentWeek.push(date);

    if (dayOfWeek === 6) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

export function YearlySummary() {
  const [summary, setSummary] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Usuário não autenticado');
      return;
    }

    api.get(`/user/${userId}/summary`).then((response) => {
      setSummary(response.data);
    }).catch((error) => {
      alert('Erro ao carregar o resumo');
    });
  }, []);

  const summaryDates = generateDatesFromYearBeginning(); 
  const months = groupDatesByMonth(summaryDates);
  const weekDays = getReorderedWeekDays(); 

  return (
    <div className="overflow-auto flex flex-col justify-center items-center gap-4">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header/>
      </div>

      {Object.keys(months).map((month) => {
        const weeks = groupDatesByWeek(months[month]);

        return (
          <div key={month} className="lg:w-2/5 m-8">
            <h2 className="text-2xl capitalize font-bold mb-4">{month}</h2>

            <div className="text-center grid grid-cols-7 gap-3 mb-4">
              {weekDays.map((day, index) => (
                <div key={index} className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
                  {day}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-3">
                  {week.map((date, dateIndex) => {
                    if (date === null) {
                      return (
                        <div
                          key={`empty-${weekIndex}-${dateIndex}`}
                          className="w-10 h-10 bg-transparent"
                        />
                      ); 
                    }

                    const dayInSummary = summary.find((day) =>
                      dayjs(date).isSame(day.date, "day")
                  );

                    return (
                      <RoutineDay
                        key={date.toString()}
                        date={date}
                        amount={dayInSummary?.amount}
                        defaultCompleted={dayInSummary?.completed}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
