"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const LiveChatComponent = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");

  const getUserAdminStatus = (): boolean => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.user.isAdmin || false;
      } catch (error) {
        console.error("Error al parsear el objeto user de localStorage:", error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStatus = getUserAdminStatus();
      const storedUser = localStorage.getItem("user");
      const userIdStored = storedUser ? JSON.parse(storedUser).user.id : "guest";

      setIsAdmin(adminStatus);
      setUserId(userIdStored);
    }
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      const socketUrl = `wss://valkiriasback.onrender.com/?isAdmin=${isAdmin}`;
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.on("chatToClient", (message) => {
        const normalizedMessage = message.message ? message.message : message;
        setMessages((prev) => [...prev, normalizedMessage]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAdmin]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: isAdmin ? "Admin" : "Usuario", content: input };
      socket.emit("chatToServer", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  if (isAdmin === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col w-[350px] h-[500px] bg-[#F3E8FF] rounded-2xl shadow-lg overflow-hidden fixed bottom-24 right-5 z-50">
      {/* Contenedor de mensajes */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#F3E8FF] flex flex-col justify-end">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-xl max-w-[70%] break-words ${
              msg.sender === (isAdmin ? "Admin" : userId)
                ? "self-end bg-[#5d306f] text-white text-left rounded-br-none"
                : "self-start bg-[#3e1a4d] text-white text-left rounded-bl-none"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      {/* Barra de entrada */}
      <div className="flex border-t border-gray-300 p-2 bg-[#F3E8FF]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-1 border border-gray-300 rounded-md mr-2 text-black text-sm"
        />
        <button
          onClick={sendMessage}
          className="py-1 px-3 bg-[#3e1a4d] text-white rounded-md text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default LiveChatComponent;
