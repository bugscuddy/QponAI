import { GoogleGenerativeAI } from '@google/generative-ai';

export const gemini = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY || ''
);

// Get the model instance
export const model = gemini.getGenerativeModel({ model: 'gemini-pro' });