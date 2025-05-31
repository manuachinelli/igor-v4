import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
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
      return NextResponse.json({ ok: false, message: 'No hay suficientes mensajes.' }, { status: 400 });
    }

    const promptText = 'Resume estos tres mensajes en una frase breve:\n' + msgs
      .map((m) => (m.role === 'user' ? `Usuario: ${m.content}` : `Asistente: ${m.content}`))
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 60,
      temperature: 0.7,
    });

    const rawText = completion.choices?.[0]?.message?.content ?? '';
    const summary = rawText.trim();

    const { error: updateError, data: updatedData } = await supabase
      .from('chat_sessions')
      .update({ summary })
      .eq('session_id', sessionId)
      .select(); // 👈 te trae lo actualizado

    if (updateError) {
      console.error('❌ Error al actualizar summary:', updateError);
      return NextResponse.json({ ok: false, message: 'Error al actualizar summary.' }, { status: 500 });
    }

    console.log('✅ Summary guardado:', updatedData);

    return NextResponse.json({ ok: true, summary });
  } catch (err) {
    console.error('❌ Exception en /api/summary:', err);
    return NextResponse.json({ ok: false, message: 'Error interno.' }, { status: 500 });
  }
}
