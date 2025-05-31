// app/api/summary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getChatSummary, Message } from '@/lib/openaiClient';

// Inicializamos Supabase (lee las variables de entorno)
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // clave con permisos de escritura
);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: 'Falta sessionId' }, { status: 400 });
  }

  // 1) Traemos los mensajes de esta sesión (ordenados por created_at)
  const { data: msgs, error: fetchError } = await sb
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(3); // solo necesitamos al menos 3 primeros

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // 2) Si hay menos de 3 mensajes, no hacemos nada
  if (!msgs || msgs.length < 3) {
    return NextResponse.json({ ok: false, message: 'No hay suficientes mensajes'. });
  }

  // 3) Pasamos esos 3 mensajes al helper de OpenAI para generar el resumen
  const messages: Message[] = msgs.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content!,
  }));

  let summary: string;
  try {
    summary = await getChatSummary(messages);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // 4) Actualizamos la tabla chat_sessions set summary = resumen
  const { error: updateError } = await sb
    .from('chat_sessions')
    .update({ summary })
    .eq('session_id', sessionId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, summary });
}
