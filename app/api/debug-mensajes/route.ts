import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ ok: false, message: 'Falta sessionId' }, { status: 400 });
  }

  // Traer el user_id de la sesión
  const { data: sessionData, error: sessionError } = await supabase
    .from('chat_sessions')
    .select('user_id')
    .eq('session_id', sessionId)
    .single();

  if (sessionError || !sessionData?.user_id) {
    return NextResponse.json({ ok: false, message: 'Sesión no encontrada' }, { status: 404 });
  }

  const userId = sessionData.user_id;

  // Buscar los mensajes de esa sesión y usuario
  const { data: msgs, error: msgError } = await supabase
    .from('chat_messages')
    .select('id, content, role, created_at')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (msgError) {
    console.error('❌ Supabase error al consultar mensajes:', msgError);
    return NextResponse.json({
      ok: false,
      message: 'Error al consultar mensajes',
      error: msgError.details ?? msgError.message ?? msgError,
    }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    sessionId,
    userId,
    count: msgs.length,
    mensajes: msgs,
  });
}
