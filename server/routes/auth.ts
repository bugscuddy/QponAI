import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';


export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/login', async ({ body }: { body: { email: string; password: string } }) => {
    const { email, password } = body
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? { success: true, user } : { success: false }
  });