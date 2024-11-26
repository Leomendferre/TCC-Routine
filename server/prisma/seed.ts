import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const userId = '3fdcaff8-06a9-4bc3-94c0-f2ec1c3cc83f';
const firstRoutineId = '0730ffac-d039-4194-9571-01aa2aa0efbd';
const secondRoutineId = '00880d75-a933-4fef-94ab-e05744435297';
const thirdRoutineId = 'fa1a1bcf-3d87-4626-8c0d-d7fd1255ac00';
const fourRoutineId = 'd2d4e1b0-2c89-4e3c-88c5-01f089d2b622';
const fiveRoutineId = 'c4e0fcb1-5f25-4b9b-8779-c34aa1e12864';

async function run() {
  try {
    // Excluir dependências primeiro
    await prisma.dayRoutine.deleteMany({});
    await prisma.routineWeekDays.deleteMany({});
    await prisma.routine.deleteMany({});
    await prisma.day.deleteMany({});

    /**
     * Criar Rotinas
     */
    await Promise.all([
      prisma.routine.create({
        data: {
          id: firstRoutineId,
          title: 'Beber 2L água',
          created_at: new Date('2024-01-01T03:00:00.000Z'),
          user_id: userId,
          weekDays: {
            create: [
              { week_day: 0 }, 
              { week_day: 1 }, 
              { week_day: 2 }, 
              { week_day: 3 }, 
              { week_day: 4 }, 
              { week_day: 5 }, 
              { week_day: 6 }, 
            ],
          },
        },
      }),

      prisma.routine.create({
        data: {
          id: secondRoutineId,
          title: 'Correr 5km',
          created_at: new Date('2024-01-01T03:00:00.000Z'),
          user_id: userId,
          weekDays: {
            create: [
              { week_day: 1 }, // Segunda-feira
              { week_day: 3 }, // Quarta-feira
              { week_day: 5 }, // Sexta-feira
            ],
          },
        },
      }),

      prisma.routine.create({
        data: {
          id: thirdRoutineId,
          title: 'Correr 12km',
          created_at: new Date('2024-01-01T03:00:00.000Z'),
          user_id: userId,
          weekDays: {
            create: [
              { week_day: 6 }, // Sabado
              { week_day: 0 }, // Domingo
            ],
          },
        },
      }),

      prisma.routine.create({
        data: {
          id: fourRoutineId,
          title: 'Ir dormir as 23 horas',
          created_at: new Date('2024-01-01T03:00:00.000Z'),
          user_id: userId,
          weekDays: {
            create: [
              { week_day: 1 }, // Segunda-feira
              { week_day: 2 }, // Terça-feira
              { week_day: 3 }, // Quarta-feira
              { week_day: 4 }, // Quinta-feira
              { week_day: 5 }, // Sexta-feira
              { week_day: 6 }, // Sabado
            ],
          },
        },
      }),

      prisma.routine.create({
        data: {
          id: fiveRoutineId,
          title: 'Investir',
          created_at: new Date('2024-01-01T03:00:00.000Z'),
          user_id: userId,
          weekDays: {
            create: [
              { week_day: 1 }, // Segunda-feira
              { week_day: 2 }, // Terça-feira
              { week_day: 3 }, // Quarta-feira
              { week_day: 4 }, // Quinta-feira
              { week_day: 5 }, // Sexta-feira
            ],
          },
        },
      }),
    ]);

    /**
     * Criar registros diários de hábitos completados para cada dia de 2024
     */
    const startDate = dayjs('2024-06-01');
    const endDate = dayjs('2024-12-31');
    const allDates: Date[] = [];

    let currentDate = startDate;

    // Gera todas as datas de 2024
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      allDates.push(currentDate.toDate());
      currentDate = currentDate.add(1, 'day');
    }

    await Promise.all(
      allDates.map(async (date) => {
        const dayOfWeek = dayjs(date).day(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

        const routinesToComplete: { routine_id: string }[] = [];

        if ([1, 3].includes(dayOfWeek)) {
          routinesToComplete.push({ routine_id: firstRoutineId });
        }
        if ([1, 3, 5].includes(dayOfWeek)) {
          routinesToComplete.push({ routine_id: secondRoutineId });
          routinesToComplete.push({ routine_id: fiveRoutineId });
        }
        if (dayOfWeek === 0) {
          routinesToComplete.push({ routine_id: thirdRoutineId });
        }
        if ([1, 2, 3, 4, 5].includes(dayOfWeek)) {
          routinesToComplete.push({ routine_id: fourRoutineId });

        }

        if ([6].includes(dayOfWeek)) {
            routinesToComplete.push({ routine_id: thirdRoutineId });
            routinesToComplete.push({ routine_id: firstRoutineId });
          }

        // Cria o dia com as rotinas
        if (routinesToComplete.length > 0) {
          await prisma.day.create({
            data: {
              date: date,
              dayRoutines: {
                create: routinesToComplete,
              },
            },
          });
        }
      })
    );

    console.log('Seed realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao realizar o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
