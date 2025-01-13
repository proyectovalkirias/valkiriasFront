"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatComponent = () => {
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const getUserAdminStatus = (): boolean => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser.user.isAdmin || false;
      } catch (error) {
        console.error(
          "Error al parsear el objeto user de localStorage:",
          error
        );
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const adminStatus = getUserAdminStatus();
      const storedUser = localStorage.getItem("user");
      const userIdStored = storedUser
        ? JSON.parse(storedUser).user.id
        : "guest";

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
    <div className="relative flex items-center justify-center h-screen">
      {/* Logo siempre visible para alternar el chat */}
      <img
        src="https://res.cloudinary.com/dwuxvipza/image/upload/v1736369135/Valki_yqz720.png"
        alt="Logo Valki"
        className="fixed bottom-5 right-5 w-20 h-20 cursor-pointer z-50"
        onClick={() => setIsChatOpen((prev) => !prev)}
      />

      {/* Ventana de chat */}
      {isChatOpen && (
       <div className="fixed bottom-32 right-5 flex flex-col h-96 w-80 border border-purple-dark rounded-3xl z-40 shadow-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 bg-purple-100 flex flex-col">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded-md max-w-[70%] ${
                  msg.sender === (isAdmin ? "Admin" : userId)
                    ? "self-end bg-[#a080b1]"
                    : "self-start bg-[#b093bf]"
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="flex border-t border-purple-dark p-2 bg-purple-100 text-black">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-3 py-2 border border-purple-dark rounded-md mr-2 bg-purple-100 "
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-purple-dark text-white rounded-md"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
