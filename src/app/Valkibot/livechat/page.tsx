"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const LiveChatComponent = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [firstname, setFirstname] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const API_URL =
  process.env.REACT_APP_API_URL || "https://valkiriasback.onrender.com";


  const getUserDetails = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser)
        return {
          isAdmin: parsedUser.user.isAdmin || false,
          firstname: parsedUser.user.firstname || "guest",
          userId: parsedUser.user.id || "guest",
        };
      } catch (error) {
        console.error("Error al parsear el objeto user de localStorage:", error);
        return { isAdmin: false, firstname: "guest", userId: "guest" };
      }
    }
    return { isAdmin: false, firstname: "guest", userId: "guest" };
  };

  useEffect(() => {
    const userDetails = getUserDetails();
    setIsAdmin(userDetails.isAdmin);
    setFirstname(userDetails.firstname);
    setUserId(userDetails.userId);
  

  
    if (userDetails) {
      const socketUrl = `wss://valkiriasback.onrender.com/?isAdmin=${userDetails.isAdmin}&firstname=${encodeURIComponent(userDetails.firstname)}&userId=${userDetails.userId}`;
      const newSocket = io(socketUrl);

      setSocket(newSocket);

      const fetchMessages = async () => {
        try {
          const response = await fetch(`${API_URL}/valkibot/messages/${userDetails.userId}`);
          const data = await response.json();
          console.log("Mensajes anteriores:", data);

          const messagesArray = data[0]?.messages || [];

          const mappedMessages = messagesArray.map((message: any) => ({
            sender: message.sender,
            content: message.content, 
          }));

          setMessages(mappedMessages);  
        } catch (error) {
          console.error("Error al obtener los mensajes:", error);
        }
      };
    
      fetchMessages();

      newSocket.on("chatToClient", (message) => {
          console.log("Mensaje recibido del servidor:", message);
          setMessages((prev) => [
          ...prev,
          { sender: message.sender, content: message.message } 
        ]);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: firstname, content: input };
      socket.emit("chatToServer", message);
      setMessages((prev) => [...prev, message]);
      setInput("");

      console.log(message);
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
              msg.sender === firstname
                ? "self-end bg-[#5d306f] text-white text-left rounded-br-none"
                : msg.sender === "Sistema"
                ? "self-center bg-[#d9d9d9] text-black text-center"
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