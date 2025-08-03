import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';

export const receiptRoutes = new Elysia({ prefix: '/receipt' })
  .post('/', async ({ body }: { body: { imageUrl: string; userId: string } }) => {
    const { imageUrl, userId } = body
    const receipt = await prisma.receipt.create({
      data: { imageUrl, userId }
    })
    return receipt
  })