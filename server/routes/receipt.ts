import { Elysia } from 'elysia';
import { prisma } from '../lib/prisma';

export const receiptRoutes = new Elysia({ prefix: '/api/receipt' })
  .post('/', async ({ body }: { body: { imageUrl: string; userId: string } }) => {
    const { imageUrl, userId } = body
    const receipt = await prisma.receipt.create({
      data: {
        imageUrl,
        userId,
        storeName: '', // provide appropriate value
        totalAmount: 0, // provide appropriate value
        date: new Date(), // provide appropriate value
        items: [] // provide appropriate value
      }
    })
    return receipt
  })