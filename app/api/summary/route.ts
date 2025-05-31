// app/api/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// 1. Inicializamos Supabase con Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. NOTA: Ya NO verificamos OPENAI_API_KEY aquí en nivel módulo.
//    Lo haremos dentro de POST, para que el build no falle.

export async function POST(req: NextRequest) {
  try {
    // 2.1. Ahora validamos la clave de OpenAI en el handler (en lugar de en el tope)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, message: 'Falta OPENAI_API_KEY en entorno' },
        { status: 500 }
      );
    }
    const openai = new OpenAI({ apiKey });

    // 2.2. Leemos el body y extraemos sessionId
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json(
        { ok: false, message: 'Falta sessionId en el request.' },
        { status: 400 }
      );
    }

    // 2.3. Traemos los primeros 3 mensajes de esta sesión
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

    // 2.4. Construimos el prompt para OpenAI con esos 3 mensajes
    const promptText =
      'Resume estos tres mensajes en una frase breve:\n' +
      msgs
        .map((m) =>
          m.role === 'user'
            ? `Usuario: ${m.content}`
            : `Asistente: ${m.content}`
        )
        .join('\n');

    // 2.5. Llamamos a la API de OpenAI para generar un resumen
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 60,
      temperature: 0.7,
    });

    // 2.6. Extraemos el texto de manera segura
    const rawText = completion.choices?.[0]?.message?.content ?? '';
    const summary = rawText.trim();

    // 2.7. Actualizamos la tabla 'chat_sessions' con el summary
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

    // 2.8. Respondemos con ok y el summary generado
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('Exception en /api/summary:', err);
    return NextResponse.json(
      { ok: false, message: 'Error interno en el servidor.' },
      { status: 500 }
    );
  }
}
