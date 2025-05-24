"use client";
import { useEffect, useState, useRef } from "react";
import sendToIgor from "@/lib/sendToIgor";
import { ArrowUp } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const USER_ID = "igor_user_001";

export default function IgorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: "Hola! Aquí estoy para charlar sobre tu negocio. ¿Qué te gustaría saber hoy?",
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isWaiting) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsWaiting(true);

    try {
      const reply = await sendToIgor(USER_ID, input);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un error. Intentá de nuevo." },
      ]);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-700 text-white self-end ml-auto"
                : "bg-gray-800 text-white self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isWaiting && (
          <div className="text-sm italic text-gray-400">Igor AI está escribiendo...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-700 p-4 flex items-center gap-2 bg-black">
        <input
          type="text"
          className="flex-1 bg-black border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500"
          placeholder="Escribí tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isWaiting}
        />
        <button
          onClick={handleSend}
          disabled={isWaiting}
          className="bg-white text-black p-2 rounded-xl"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
