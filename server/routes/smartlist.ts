import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';

export const smartListRoutes = new Elysia({ prefix: '/smartlist' })
  .get('/', async () => {
    const lists = await prisma.smartlist.findMany()
    return lists
  })