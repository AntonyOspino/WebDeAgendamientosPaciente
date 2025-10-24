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
import { useState, useEffect } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      message: "Hola 👋 soy tu asistente médico virtual especializado en salud cardiovascular, ¿en qué puedo ayudarte?", 
      sender: "bot",
      direction: "incoming"
    }
  ]);
  const [typing, setTyping] = useState(false);
  const [sessionId] = useState(() => `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const handleSend = async (text) => {
    // Agregar mensaje del usuario
    const newMsg = { 
      message: text, 
      direction: "outgoing", 
      sender: "user" 
    };
    setMessages((prev) => [...prev, newMsg]);
    setTyping(true);

    try {
      // 🔌 Conectar con Rasa
      const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sessionId,
          message: text
        })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo conectar con el asistente`);
      }

      const data = await response.json();
      
      setTyping(false);

      // Agregar respuestas del bot
      if (data && data.length > 0) {
        const botMessages = data.map(msg => ({
          message: msg.text || msg.custom?.text || "Lo siento, no tengo respuesta para eso.",
          sender: "bot",
          direction: "incoming"
        }));
        
        setMessages((prev) => [...prev, ...botMessages]);
      } else {
        // Si no hay respuesta, mostrar mensaje por defecto
        setMessages((prev) => [...prev, {
          message: "Lo siento, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?",
          sender: "bot",
          direction: "incoming"
        }]);
      }

    } catch (error) {
      console.error('Error al comunicarse con Rasa:', error);
      setTyping(false);
      
      setMessages((prev) => [...prev, {
        message: "⚠️ No pude conectarme con el asistente. Por favor, verifica que el servidor esté activo.",
        sender: "bot",
        direction: "incoming"
      }]);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chat */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        aria-label="Abrir chat de asistente médico"
      >
        <FaComments size={24} />
      </button>

      {/* Ventana de chat */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "380px",
            height: "500px",
            zIndex: 9999,
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)"
          }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList 
                typingIndicator={typing ? <TypingIndicator content="El asistente está escribiendo..." /> : null}
              >
                {messages.map((m, i) => (
                  <Message key={i} model={m} />
                ))}
              </MessageList>
              <MessageInput 
                placeholder="Escribe tu mensaje..." 
                onSend={handleSend}
                disabled={typing}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </>
  );
}



// "use client";

// import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
// import {
//   MainContainer,
//   ChatContainer,
//   MessageList,
//   Message,
//   MessageInput,
//   TypingIndicator
// } from "@chatscope/chat-ui-kit-react";
// import { useState } from "react";
// import { FaComments } from "react-icons/fa";

// export default function ChatWidget() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { message: "Hola 👋 soy tu asistente médico virtual, ¿en qué puedo ayudarte?", sender: "bot" }
//   ]);
//   const [typing, setTyping] = useState(false);

//   const handleSend = async (text) => {
//     const newMsg = { message: text, direction: "outgoing", sender: "user" };
//     setMessages((prev) => [...prev, newMsg]);
//     setTyping(true);

//     // 🔹 Aquí luego conectas tu bot Rasa (por ahora respuesta simulada)
//     setTimeout(() => {
//       const fakeResponse = "Entendido ✅. Estoy revisando tu información...";
//       setMessages((prev) => [...prev, { message: fakeResponse, sender: "bot" }]);
//       setTyping(false);
//     }, 1000);
//   };

//   return (
//     <>
//       {/* Botón flotante para abrir/cerrar el chat */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
//       >
//         <FaComments size={20} />
//       </button>

//       {/* Ventana de chat */}
//       {open && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "90px",
//             right: "20px",
//             width: "350px",
//             height: "420px",
//             zIndex: 9999,
//             borderRadius: "12px",
//             overflow: "hidden",
//             boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
//           }}
//         >
//           <MainContainer>
//             <ChatContainer>
//               <MessageList typingIndicator={typing ? <TypingIndicator content="El bot está escribiendo..." /> : null}>
//                 {messages.map((m, i) => (
//                   <Message key={i} model={m} />
//                 ))}
//               </MessageList>
//               <MessageInput placeholder="Escribe tu mensaje..." onSend={handleSend} />
//             </ChatContainer>
//           </MainContainer>
//         </div>
//       )}
//     </>
//   );
// }
