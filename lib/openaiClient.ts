import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatSummary(messages: Message[]): Promise<string> {
  const recent = messages.slice(0, 3);
  const payload = [
    {
      role: 'system',
      content:
        'Resume brevemente este intercambio en una sola frase clara (menos de 14 caracteres).',
    },
    ...recent,
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: payload as any,
    max_tokens: 60,
  });

  return completion.choices?.[0]?.message?.content?.trim() ?? '';
}

