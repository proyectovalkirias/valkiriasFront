"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LiveChatComponent from "@/app/Valkibot/livechat/page"; // Importación del componente LiveChatComponent

const ChatComponent = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isBotActive, setIsBotActive] = useState(false); // Inicialmente cerrado
  const [isLiveChatActive, setIsLiveChatActive] = useState(false); // Estado para LiveChatComponent
  const [botResponse, setBotResponse] = useState<{
    reply: string;
    options?: { id: string; label: string }[];
  }>({
    reply: "",
    options: [],
  });

  // Lógica de respuestas del bot
  const fetchBotResponse = async (message: string) => {
    try {
      const response = await fetch("https://valkiriasback.onrender.com/valkibot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setBotResponse(data);
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  // Se ejecuta cuando el estado del bot es activado
  useEffect(() => {
    if (isBotActive) {
      fetchBotResponse("inicio"); // Se envía un mensaje inicial al bot
    }
  }, [isBotActive]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "User", content: input }]);
    await fetchBotResponse(input); // Respuesta automática del bot con el mensaje del usuario
    setInput(""); // Limpiar el campo de entrada
  };

  const handleBotOptionClick = async (optionId: string) => {
    if (optionId === "chat") {
      setIsBotActive(false); // Cierra el chatbot
      setIsLiveChatActive(true); // Abre el LiveChatComponent
    } else {
      setMessages((prev) => [...prev, { sender: "User", content: optionId }]);
      await fetchBotResponse(optionId); // Respuesta automática del bot con la opción seleccionada
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <motion.img
        src="https://res.cloudinary.com/dwuxvipza/image/upload/v1736369135/Valki_yqz720.png"
        alt="Logo"
        className="w-16 h-16 cursor-pointer fixed bottom-5 right-5 z-50"
        onClick={() => {
          setIsBotActive((prev) => !prev); // Alternar visibilidad del bot
          setIsLiveChatActive(false); // Cierra el LiveChatComponent si está abierto
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      {!isBotActive && !isLiveChatActive && (
        <motion.div
          className="absolute bottom-20 right-5 bg-[#3e1a4d] text-white py-2 px-5 rounded-full shadow-lg text-sm text-center w-52"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Hola, soy Valki y estoy para ayudarte
        </motion.div>
      )}

      {isBotActive && (
        <motion.div
          className="flex flex-col w-[350px] h-[500px] bg-[#F3E8FF] rounded-2xl shadow-lg overflow-hidden fixed bottom-24 right-5 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 bg-[#F3E8FF] flex flex-col justify-end">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`my-2 p-2 rounded-xl max-w-[70%] break-words ${
                  msg.sender === "User"
                    ? "self-end bg-[#5d306f] text-white text-left rounded-br-none"
                    : "self-start bg-[#3e1a4d] text-white text-left rounded-bl-none"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <strong>{msg.sender}:</strong> {msg.content}
              </motion.div>
            ))}

            {/* Bot options */}
            {botResponse.options && (
              <div className="flex flex-col space-y-2">
                {botResponse.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleBotOptionClick(option.id)}
                    className="py-1 px-3 bg-[#3e1a4d] text-white rounded-md text-sm"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input box at the bottom */}
          <div className="flex border-t border-gray-300 p-2 bg-[#F3E8FF]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-1 border border-gray-300 rounded-md mr-2 text-black text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="py-1 px-3 bg-[#3e1a4d] text-white rounded-md text-sm"
            >
              Enviar
            </button>
          </div>
        </motion.div>
      )}

      {/* Mostrar el componente LiveChatComponent si está activo */}
      {isLiveChatActive && <LiveChatComponent />}
    </div>
  );
};

export default ChatComponent;
