"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Mic } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function IgorChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsWaiting(true);

    try {
      const res = await fetch("https://manuachinelli.app.n8n.cloud/webhook/d6a72405-e6de-4e91-80da-9219b57633dd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "igor_user_001",
          message: input,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Ocurrió un error. Intentá de nuevo." }]);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-4">
      <div className="flex-grow overflow-y-auto space-y-4 pb-32">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-lg px-4 py-2 rounded-2xl w-fit break-words ${
              msg.role === "user"
                ? "bg-blue-600 self-end text-right"
                : "bg-neutral-800 self-start text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isWaiting && (
          <div className="text-sm text-neutral-400">Igor está escribiendo...</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="fixed bottom-4 left-4 right-4 flex items-center gap-2 bg-neutral-900 rounded-full px-4 py-2">
        <input
          className="flex-grow bg-transparent outline-none text-white placeholder-neutral-500"
          placeholder="Escribí tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} className="text-white hover:text-blue-400">
          <SendHorizonal size={20} />
        </button>
        <button className="text-white opacity-50 cursor-not-allowed">
          <Mic size={20} />
        </button>
      </div>
    </div>
  );
}
