import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export async function appRoutes(app: FastifyInstance) {
  
  app.post('/register', async (request, reply) => {
    const createUser = z.object({
      username: z.string(),
       password: z.string()  
   })
    const { username, password } = createUser.parse(request.body)

    const user = await prisma.user.create({
      data: {
        username,
        password
      },
    });
  
    reply.send(user);
  });

  app.post('/login', async (request, reply) => {
    const User = z.object({
      username: z.string(),
       password: z.string()  
   })
    const { username, password } = User.parse(request.body)
  
    const user = await prisma.user.findUnique({
      where: {
        username,
        password
      },
    });
  
    if (!user) {
      reply.status(401).send('Usuário não encontrado');
      return;
    }

    reply.send({ id: user.id, username: user.username });
  });

  app.post('/user/:id/routines', async (request) => {
    const createRoutineBody = z.object({
      title: z.string(),
      weekDays: z.array(
        z.number().min(0).max(6)
      ),
    })

    const routineUser = z.object({
      id: z.string().uuid(),
    })

    const { title, weekDays } = createRoutineBody.parse(request.body)
    const { id } = routineUser.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    await prisma.routine.create({
      data: {
        user_id: id,
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay,
              }
          }),
        }
      }
    })
  })  

  app.get('/day', async (request) => {
    const getDayParams = z.object({
      date: z.coerce.date(),
      user_id: z.string().uuid()
    })

    const { date, user_id } = getDayParams.parse(request.query)

    const parsedDate = dayjs(date).startOf('day')
    const weekDay = parsedDate.get('day')

    const possibleRoutines = await prisma.routine.findMany({
      where: {
        created_at: {
          lte: date,
        },
        weekDays: {
          some: {
            week_day: weekDay,
          }
        },
        user_id: user_id
      },
    })

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayRoutines: true,
      }
    })

    const completedRoutines = day?.dayRoutines.map(dayRoutine => {
      return dayRoutine.routine_id
    }) ?? []

    return{
      possibleRoutines,
      completedRoutines,
    }
  })

  app.patch('/routines/:id/toggle', async (request) => {
    const toggleRoutinesParams = z.object({
      id: z.string().uuid(),
    })

    const { id } = toggleRoutinesParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    const dayRoutine = await prisma.dayRoutine.findUnique({
      where: {
        day_id_routine_id: {
          day_id: day.id,
          routine_id: id
        }
      }
    }) 

    if (dayRoutine) {
      await prisma.dayRoutine.delete({
        where: {
          id: dayRoutine.id,
        }
      })
    } else {
      await prisma.dayRoutine.create({
        data: {
          day_id: day.id,
          routine_id: id
        }
      })
    }

  })
 
  app.get('/user/:id/summary', async (request) => {
    const routineUser = z.object({
      id: z.string().uuid(),
    })

    const { id } = routineUser.parse(request.params)

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            CAST(COUNT(*) AS FLOAT)
          FROM day_routines DH
          JOIN routines T ON DH.routine_id = T.id
          WHERE DH.day_id = D.id
            AND T.user_id = ${id}
        ) AS completed,
        (
          SELECT
            CAST(COUNT(*) AS FLOAT)
          FROM routine_week_days HWD
          JOIN routines H ON H.id = HWD.routine_id
          WHERE
            HWD.week_day = CAST(STRFTIME('%w', D.date / 1000.0, 'unixepoch') AS INT)
            AND H.created_at <= D.date
            AND H.user_id = ${id}
        ) AS amount
      FROM days D
    `
    
    return summary
  })

  app.delete('/routines/:id/delete', async (request) => {
    const deleteRoutineParams = z.object({
      id: z.string().uuid(),
    });
  
    const { id } = deleteRoutineParams.parse(request.params);
    try {
      await prisma.dayRoutine.deleteMany({
        where: {
          routine_id: id,
        },
      });

      await prisma.routineWeekDays.deleteMany({
        where: {
          routine_id: id,
        },
      });

      await prisma.routine.delete({
        where: {
          id,
        },
      });
  
      return { message: 'Alvo excluído com sucesso' };
    } catch (error) {
      console.error('Erro ao excluir o alvo:', error);
      return ('Erro ao excluir o alvo');
    }
  });

  app.post('/reset-password', async (request, reply) => {
    const resetPasswordSchema = z.object({
      username: z.string(),
      newPassword: z.string(),
    });
  
    const { username, newPassword } = resetPasswordSchema.parse(request.body);
  
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
  
    if (!user) {
      reply.status(404).send('Usuário não encontrado');
      return;
    }
  
    await prisma.user.update({
      where: {
        username,
      },
      data: {
        password: newPassword,
      },
    });
  
    reply.send('Senha alterada com sucesso');
  });
}
