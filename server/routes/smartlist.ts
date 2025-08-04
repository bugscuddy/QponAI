import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';

export const smartListRoutes = new Elysia({ prefix: '/api/smartlist' })
  .get('/', async () => {
    const lists = await prisma.smartList.findMany()
    return lists
  })