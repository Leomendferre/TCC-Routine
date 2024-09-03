import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check, Trash } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface RoutineLisProps {
  date: Date;
  onCompletedChanged: (completed: number) => void
}

interface RoutinesInfo {
  possibleRoutines: {
    id: string;
    title: string;
    created_at: string;
  }[],
  completedRoutines: string[]
}

export function RoutinesList({ date, onCompletedChanged }: RoutineLisProps) {
  const [routinesInfo, setRoutinesInfo] = useState<RoutinesInfo>()

  useEffect(() => {
    const userId = localStorage.getItem('userId');
  
    api.get('day', {
      params: {
        date: date.toISOString(),
        user_id: userId
      }
    }).then(response => {
      setRoutinesInfo(response.data)
    })
  }, [])

  async function handleToggleRoutine(routineId: string) {
    await api.patch(`/routines/${routineId}/toggle`)

    const isRoutineAlreadyCompleted = routinesInfo!.completedRoutines.includes(routineId)

    let completedRoutines: string[] = []
    
    if (isRoutineAlreadyCompleted){
      completedRoutines = routinesInfo!.completedRoutines.filter(id => id !== routineId)
    } else {
      completedRoutines = [...routinesInfo!.completedRoutines, routineId]
    }

    setRoutinesInfo({
      possibleRoutines: routinesInfo!.possibleRoutines,
      completedRoutines,
    })

    onCompletedChanged(completedRoutines.length)
  }

  async function handleDeleteRoutine(routineId: string) {
    await api.delete(`/routines/${routineId}/delete`);

    const newPossibleRoutines = routinesInfo!.possibleRoutines.filter(routine => routine.id !== routineId);
    const newCompletedRoutines = routinesInfo!.completedRoutines.filter(id => id !== routineId);

    setRoutinesInfo({
      possibleRoutines: newPossibleRoutines,
      completedRoutines: newCompletedRoutines,
    });

    onCompletedChanged(newCompletedRoutines.length);
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {routinesInfo?.possibleRoutines.map(routine => {
        return (
          <div key={routine.id} className="flex items-center gap-3 group">
            <Checkbox.Root
              onCheckedChange={() => handleToggleRoutine(routine.id)}
              checked={routinesInfo.completedRoutines.includes(routine.id)}
              disabled={isDateInPast}
              className='flex items-center gap-3 group'
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-blue-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                {routine.title}
              </span>
            </Checkbox.Root>
            <button onClick={() => handleDeleteRoutine(routine.id)} className="text-red-500 hover:text-red-700">
              <Trash size={20} />
            </button>
          </div>
        )
      })}
    </div>
  )
}