import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';
import DatePicker from 'react-datepicker'; // Importando o calendário
import 'react-datepicker/dist/react-datepicker.css'; // Importando o CSS do calendário
import { addDays } from 'date-fns'; // Para lidar com datas

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function NewRoutinesForm() {
  const [title, setTitle] = useState('')
  const [weekDays, setWeekDays] = useState<number[]>([])
  const [endDate, setEndDate] = useState<Date | null>(null)
  const userId = localStorage.getItem('userId');
  const isoEndDate = endDate ? endDate.toISOString() : null;

  async function createNewRoutine(event: FormEvent) {
    event.preventDefault()

    if (!title || weekDays.length === 0) {
      return(
        alert('Digite o nome do seu Routine, e selecione um dia da semana!')
      )
    }

    console.log('User ID:', userId);

    await api.post(`/user/${userId}/routines`, {
      title,
      weekDays,
      ...(isoEndDate && { end_date: isoEndDate }), 
    })

    setTitle('')
    setWeekDays([])
    setEndDate(null)

    alert('Routine criado com sucesso!')

  }

  function handleToggleWeekDay(weekDay: number) {
    if(weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)

      setWeekDays(weekDaysWithRemovedOne)
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay]

      setWeekDays(weekDaysWithAddedOne)
    }
  }

  return(
    <form onSubmit={createNewRoutine} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semiboold leading-tight">
        Qual seu objetivo?
      </label>

      <input 
      type="text" 
      id="title"
      placeholder="ex.: Exercícios, dormir bem, etc..."
      className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
      autoFocus
      value={title}
      onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor="" className="font-semiboold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="mt-3 flex flex-col gap-2">
        {availableWeekDays.map((weekDay, index) => {
          return( 
            <Checkbox.Root 
              key={weekDay} 
              className="flex items-center gap-3 group"
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToggleWeekDay(index)}
              >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-red-500 group-data-[state=checked]:border-red-500">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="text-white leading-tight">
              {weekDay}
            </span>
          </Checkbox.Root>
          )
        })}
          
        </div>

      <label htmlFor="endDate" className="font-semibold leading-tight mt-4">
        Deseja definir até quando esse hábito vai durar?
      </label>
      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)} 
        minDate={new Date()}
        maxDate={addDays(new Date(), 365)} 
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white"
        dateFormat="dd/MM/yyyy"
        placeholderText="Selecione uma data"
      />

      <button type="submit" className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-red-600 hover:bg-red-500">
        <Check size={20} weight="bold" />
        Confirmar
      </button>
    </form>
  )
}