import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { ProgressBar } from './ProgressBar';
import dayjs from 'dayjs';
import { RoutinesList } from './RoutinesList';
import { useState, useEffect } from 'react';

interface RoutineDayProps {
  date: Date
  defaultCompleted?: number
  amount?: number
}

export function RoutineDay({ defaultCompleted = 0, amount = 0, date }: RoutineDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);
  const [completedPercentage, setCompletedPercentage] = useState(0);

  useEffect(() => {
    const initialCompletedPercentage = amount > 0 ? Math.round((defaultCompleted / amount) * 100) : 0;
    setCompletedPercentage(initialCompletedPercentage)
  }, [defaultCompleted, amount])

  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOffWeek = dayjs(date).format('dddd')

  function handleCompletedChanged(completed: number) {
    setCompleted(completed)
    const newCompletedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0
    setCompletedPercentage(newCompletedPercentage)
  }

  return (
    <Popover.Root>
      <Popover.Trigger 
      className={clsx('w-10 h-10  border-2  rounded-lg', {
          'bg-zinc-900 border-zinc-800': completedPercentage === 0,
          'bg-green-900 border-green-700': completedPercentage > 0 && completedPercentage < 20,
          'bg-green-800 border-green-600': completedPercentage >= 20 && completedPercentage < 40,
          'bg-green-700 border-green-500': completedPercentage >= 40 && completedPercentage < 60,
          'bg-green-600 border-green-500': completedPercentage >= 60 && completedPercentage < 80,
          'bg-green-500 border-green-400': completedPercentage >= 80,
        })} 
      />
      
      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOffWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPercentage} />

          <RoutinesList date={date} onCompletedChanged={handleCompletedChanged} />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}