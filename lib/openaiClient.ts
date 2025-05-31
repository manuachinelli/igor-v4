// lib/openaiClient.ts

import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Toma los primeros tres mensajes (user + assistant) y devuelve un resumen breve.
 */
export async function getChatSummary(messages: Message[]): Promise<string> {
  // 1) Selecciono los primeros 3 mensajes (o menos)
  const recent = messages.slice(0, 3).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // 2) Armo el payload que enviaremos a OpenAI
  const payload = [
    {
      role: 'system',
      content:
        'Resume brevemente este intercambio en una sola frase clara (menos de 14 caracteres).',
    },
    ...recent,
  ];

  // 3) Hago la llamada a OpenAI, pero casteo `payload` a `any` para evitar errores de tipos
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: payload as any,   // <-- aquí forzamos `any`
    max_tokens: 60,
  });

  // 4) Extraigo el texto de manera segura y lo devuelvo truncando espacios
  const rawText = completion.choices?.[0]?.message?.content ?? '';
  return rawText.trim();
}
