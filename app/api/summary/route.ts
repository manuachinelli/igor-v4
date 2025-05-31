// app/api/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// 1. Inicializamos Supabase con las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Inicializamos OpenAI con tu API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('No se encontró OPENAI_API_KEY en .env.local');
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 3. Exportamos la función POST que Next.js usará como handler
export async function POST(req: NextRequest) {
  try {
    // 3.1. Leemos el body y extraemos sessionId
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { ok: false, message: 'Falta sessionId en el request.' },
        { status: 400 }
      );
    }

    // 3.2. Traemos los primeros 3 mensajes de esta sesión
    const { data: msgs, error: fetchError } = await supabase
      .from('chat_messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(3);

    if (fetchError) {
      console.error('Error al consultar mensajes:', fetchError);
      return NextResponse.json(
        { ok: false, message: 'Error al consultar mensajes.' },
        { status: 500 }
      );
    }

    if (!msgs || msgs.length < 3) {
      return NextResponse.json(
        { ok: false, message: 'No hay suficientes mensajes para resumir.' },
        { status: 400 }
      );
    }

    // 3.3. Construimos el prompt para OpenAI con esos 3 mensajes
    const promptText =
      'Resume estos tres mensajes en una frase breve:\n' +
      msgs
        .map((m) => (m.role === 'user' ? `Usuario: ${m.content}` : `Asistente: ${m.content}`))
        .join('\n');

    // 3.4. Llamamos a la API de OpenAI para generar un resumen
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 60,
      temperature: 0.7,
    });

    // Sustituimos el acceso directo para evitar posibles null/undefined
    const rawText = completion.choices?.[0]?.message?.content ?? '';
    const summary = rawText.trim();

    // 3.5. Actualizamos la tabla 'chat_sessions' con el summary
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ summary })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Error al guardar el resumen en chat_sessions:', updateError);
      return NextResponse.json(
        { ok: false, message: 'Error al guardar el resumen.' },
        { status: 500 }
      );
    }

    // 3.6. Respondemos con ok y el summary generado
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('Exception en /api/summary:', err);
    return NextResponse.json(
      { ok: false, message: 'Error interno en el servidor.' },
      { status: 500 }
    );
  }
}
