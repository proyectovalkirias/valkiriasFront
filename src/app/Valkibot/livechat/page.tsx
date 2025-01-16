"use client";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const LiveChatComponent = () => {
  const [messages, setMessages] = useState<
    { sender: string; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Referencia para hacer scroll al final

  const API_URL =
    process.env.REACT_APP_API_URL || "https://valkiriasback.onrender.com";

    const getUserDetails = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return {
            isAdmin: parsedUser.isAdmin || false,
            firstname: parsedUser.firstname || "guest",
            userId: parsedUser.id || "guest",
          };
        } catch (error) {
          return { isAdmin: false, firstname: "guest", userId: "guest" };
        }
      }
      return { isAdmin: false, firstname: "guest", userId: "guest" };
    };
    

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails.userId !== "guest") {
      setIsLoggedIn(true);
      setIsAdmin(userDetails.isAdmin);
      setFirstname(userDetails.firstname);
      setUserId(userDetails.userId);

      const socketUrl = `wss://valkiriasback.onrender.com/?isAdmin=${
        userDetails.isAdmin
      }&firstname=${encodeURIComponent(userDetails.firstname)}&userId=${
        userDetails.userId
      }`;
      const newSocket = io(socketUrl);

      setSocket(newSocket);

      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `${API_URL}/valkibot/messages/${userDetails.userId}`
          );
          const data = await response.json();
          const messagesArray = data[0]?.messages || [];
          const mappedMessages = messagesArray.map((message: any) => ({
            sender: message.sender,
            content: message.content,
          }));

          setMessages([
            {
              sender: "Sistema",
              content:
                "¡Te estamos derivando al chat en vivo para que hables con un humano! 💬 Nuestro equipo está listo para ayudarte. 🙌",
            },
            ...mappedMessages,
          ]);
        } catch (error) {
          console.error("Error al obtener los mensajes:", error);
        }
      };

      fetchMessages();

      newSocket.on("chatToClient", (message) => {
        setMessages((prev) => [
          ...prev,
          { sender: message.sender, content: message.message },
        ]);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      setMessages([
        {
          sender: "Sistema",
          content:
            "Inicia sesión o regístrate para comunicarte con un miembro del equipo.",
        },
      ]);
    }
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: firstname, content: input };
      socket.emit("chatToServer", message);
      setMessages((prev) => [...prev, message]);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Evitar salto de línea
      sendMessage();
    }
  };

  // Función para desplazar hacia abajo cuando se agregan nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoggedIn === null) {
    return <div>...Cargando</div>;
  }

  return (
    <div className="fixed bottom-36 right-5 z-50 flex flex-col w-[350px] h-[500px] bg-[#F3E8FF] rounded-2xl shadow-lg overflow-hidden">
      {/* Contenedor de mensajes */}
      <div className="flex-1 overflow-y-auto p-2 bg-[#F3E8FF] flex flex-col justify-end">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-xl max-w-[70%] break-words ${
              msg.sender === firstname
                ? "self-end bg-[#5d306f] text-white text-left rounded-br-none"
                : msg.sender === "Sistema"
                ? "self-start bg-[#3e1a4d] text-white text-left rounded-bl-none"
                : "self-start bg-[#3e1a4d] text-white text-left rounded-bl-none"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
        {/* Elemento invisible para desplazarse al final */}
        <div ref={messagesEndRef} />
      </div>

      {/* Barra de entrada */}
      <div className="flex border-t border-gray-300 p-2 bg-[#F3E8FF]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 p-1 border border-gray-300 rounded-md mr-2 text-black text-sm"
          disabled={!isLoggedIn}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="py-1 px-3 bg-[#3e1a4d] text-white rounded-md text-sm"
          disabled={!isLoggedIn}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default LiveChatComponent;
