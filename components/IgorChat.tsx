const handleSend = async () => {
  if (!input.trim() || !uuid) return;

  // 1) Mostrar tu mensaje en pantalla de inmediato
  const newMessage: Message = { role: 'user', content: input };
  setMessages((prev) => [...prev, newMessage]);

  const texto = input;
  setInput('');
  setIsWaiting(true);

  try {
    // 2) Guardar mensaje en Supabase
    await supabase.from('chat_messages').insert({
      user_id: uuid,
      session_id: sessionId,
      role: 'user',
      content: texto,
    });

    // 3) Llamar al webhook para obtener respuesta
    const res = await fetch(
      'https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: texto,
          userId: uuid,
          sessionId,
        }),
      }
    );

    const data = await res.json();
    if (data.reply) {
      const replyMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, replyMessage]);

      // Guardar la respuesta en Supabase
      await supabase.from('chat_messages').insert({
        user_id: uuid,
        session_id: sessionId,
        role: 'assistant',
        content: replyMessage.content,
      });
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: 'Error al contactar con Igor.' },
    ]);
  } finally {
    setIsWaiting(false);
  }
};

export default IgorChat;
