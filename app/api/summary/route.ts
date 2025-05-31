import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ Falta OPENAI_API_KEY en el entorno.');
      return NextResponse.json({ ok: false, message: 'Falta OPENAI_API_KEY' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ ok: false, message: 'Falta sessionId' }, { status: 400 });
    }

    const { data: msgs, error: fetchError } = await supabase
      .from('chat_messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(3);

    if (fetchError || !msgs || msgs.length < 3) {
      console.error('❌ No hay suficientes mensajes o error en la consulta:', fetchError);
      return NextResponse.json({ ok: false, message: 'No hay suficientes mensajes.' }, { status: 400 });
    }

    const promptText =
      'Generá un título breve para esta conversación:\n' +
      msgs
        .map((m) =>
          m.role === 'user' ? `Usuario: ${m.content}` : `Asistente: ${m.content}`
        )
        .join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 60,
      temperature: 0.7,
    });

    const summary = completion.choices?.[0]?.message?.content?.trim() ?? '';

    console.log('🧠 Título generado:', summary);

    const { error: updateError, data: updated } = await supabase
      .from('chat_sessions')
      .update({ summary })
      .eq('session_id', sessionId)
      .select();

    if (updateError) {
      console.error('❌ Error al actualizar el summary en Supabase:', updateError);
      return NextResponse.json({ ok: false, message: 'Error al guardar el resumen.' }, { status: 500 });
    }

    console.log('✅ Supabase actualizó:', updated);

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('❌ Excepción en el handler:', err);
    return NextResponse.json({ ok: false, message: 'Error interno' }, { status: 500 });
  }
}
