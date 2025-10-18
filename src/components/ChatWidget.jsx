"use client";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { message: "Hola 👋 soy tu asistente médico virtual, ¿en qué puedo ayudarte?", sender: "bot" }
  ]);
  const [typing, setTyping] = useState(false);

  const handleSend = async (text) => {
    const newMsg = { message: text, direction: "outgoing", sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setTyping(true);

    // 🔹 Aquí luego conectas tu bot Rasa (por ahora respuesta simulada)
    setTimeout(() => {
      const fakeResponse = "Entendido ✅. Estoy revisando tu información...";
      setMessages((prev) => [...prev, { message: fakeResponse, sender: "bot" }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        <FaComments size={20} />
      </button>

      {/* Ventana de chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "420px",
            zIndex: 9999,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList typingIndicator={typing ? <TypingIndicator content="El bot está escribiendo..." /> : null}>
                {messages.map((m, i) => (
                  <Message key={i} model={m} />
                ))}
              </MessageList>
              <MessageInput placeholder="Escribe tu mensaje..." onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </>
  );
}
