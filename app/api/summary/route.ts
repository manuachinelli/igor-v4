// app/api/summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { createClient } from '@supabase/supabase-js';

// 1. Inicializamos Supabase con las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; 
// → SUPABASE_SERVICE_ROLE_KEY debe estar en .env.local (no en NEXT_PUBLIC_)
//    porque lo usaremos en el servidor para escribir el resumen en la tabla.
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Inicializamos OpenAI con tu API key
const openaiCfg = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiCfg);

// 3. Exportamos la función POST que Next.js reconocerá como handler
export async function POST(req: NextRequest) {
  try {
    // 3.1. Leemos el body y extraemos sessionId
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ ok: false, message: 'Falta sessionId en el request.' }, { status: 400 });
    }

    // 3.2. Traemos los últimos 3 mensajes de esta sesión
    const { data: msgs, error: fetchError } = await supabase
      .from('chat_messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(3);

    if (fetchError) {
      console.error('Error al consultar mensajes:', fetchError);
      return NextResponse.json({ ok: false, message: 'Error al consultar mensajes.' }, { status: 500 });
    }

    if (!msgs || msgs.length < 3) {
      return NextResponse.json({ ok: false, message: 'No hay suficientes mensajes para resumir.' }, { status: 400 });
    }

    // 3.3. Construimos el prompt para OpenAI con esos 3 mensajes
    const promptText =
      'Resume estos tres mensajes en una frase o título breve:\n' +
      msgs.map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');

    // 3.4. Llamamos a la API de OpenAI para que genere un resumen
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: promptText,
      max_tokens: 60,
      temperature: 0.7,
    });

    const summary = completion.data.choices[0].text?.trim() || '';

    // 3.5. Actualizamos la tabla 'chat_sessions' con el summary
    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ summary })
      .eq('session_id', sessionId);

    if (updateError) {
      console.error('Error al guardar el resumen en chat_sessions:', updateError);
      return NextResponse.json({ ok: false, message: 'Error al guardar el resumen.' }, { status: 500 });
    }

    // 3.6. Respondemos con ok y el summary generado
    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('Exception en /api/summary:', err);
    return NextResponse.json({ ok: false, message: 'Error interno en el servidor.' }, { status: 500 });
  }
}
