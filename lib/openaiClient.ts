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
  // Selecciono los primeros 3 mensajes (o menos, si no hay tantos)
  const recent = messages.slice(0, 3).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Antepongo un system prompt que guíe la generación del resumen
  const payload = [
    {
      role: 'system',
      content:
        'Resume brevemente el siguiente intercambio de mensajes en una sola frase clara, de no mas de 14 caracteres'.',
    },
    ...recent,
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: payload,
    max_tokens: 60,
  });

  return completion.choices[0].message.content.trim();
}
