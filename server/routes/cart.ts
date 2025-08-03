import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';

export const cartRoutes = new Elysia({ prefix: '/cart' })
  .get('/', async () => {
    const cart = await prisma.cartItem.findMany()
    return cart
  })