import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { openai } from '@/lib/openaiClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ ok: false, message: 'Falta sessionId' }, { status: 400 });
  }

  // Buscamos el user_id correspondiente
  const { data: sessionData, error: sessionError } = await supabase
    .from('chat_sessions')
    .select('user_id')
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !sessionData?.user_id) {
    return NextResponse.json({ ok: false, message: 'Sesión no encontrada' }, { status: 404 });
  }

  const userId = sessionData.user_id;

  // Traemos los mensajes (sin orden específico)
  const { data: msgs, error: msgError } = await supabase
    .from('chat_messages')
    .select('content, role')
    .eq('session_id', sessionId)
    .eq('user_id', userId);

  if (msgError || !msgs) {
    return NextResponse.json({
      ok: false,
      message: 'Error al consultar mensajes',
      error: msgError,
    }, { status: 500 });
  }

  // Solo usamos los primeros 3-5 mensajes del usuario para resumir
  const mensajesUsuario = msgs
    .filter((m) => m.role === 'user')
    .slice(0, 5)
    .map((m) => m.content)
    .join('\n');

  if (!mensajesUsuario || mensajesUsuario.length < 10) {
    return NextResponse.json({ ok: false, message: 'No hay suficientes mensajes del usuario' });
  }

  // Llamamos a OpenAI para generar un título
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu tarea es leer los primeros mensajes del usuario en un chat de trabajo, y generar un título breve de la conversación que sirva para reconocerla. El título debe tener máximo 5 palabras y usar lenguaje claro.',
        },
        {
          role: 'user',
          content: mensajesUsuario,
        },
      ],
    });

    const title = response.choices[0].message.content?.trim().replace(/^["']|["']$/g, '') || null;

    if (!title) {
      return NextResponse.json({ ok: false, message: 'No se pudo generar un título' });
    }

    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ summary: title })
      .eq('session_id', sessionId);

    if (updateError) {
      return NextResponse.json({ ok: false, message: 'No se pudo guardar el título' });
    }

    return NextResponse.json({ ok: true, summary: title });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: 'Error con OpenAI', error: err.me
