"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


const ChatComponent = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 
  const [userId, setUserId] = useState<string>('');

  
  const getUserAdminStatus = (): boolean => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('parsedUser:', parsedUser); 
        return parsedUser.user.isAdmin || false; 
      } catch (error) {
        console.error('Error al parsear el objeto user de localStorage:', error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    
    if (typeof window !== 'undefined') {
      const adminStatus = getUserAdminStatus(); 
      const storedUser = localStorage.getItem('user');
      const userIdStored = storedUser ? JSON.parse(storedUser).user.id : 'guest'; 

      setIsAdmin(adminStatus);
      setUserId(userIdStored);
    }
  }, []);

  useEffect(() => {
    if (isAdmin !== null) {
      const socketUrl = `wss://valkiriasback.onrender.com/?isAdmin=${isAdmin}`;
      const newSocket = io(socketUrl);
      setSocket(newSocket);
      console.log('Conectado al WebSocket con URL:', socketUrl);
  
      newSocket.on('chatToClient', (message) => {
        
        const normalizedMessage = message.message ? message.message : message;
  
        console.log('Mensaje recibido del servidor:', normalizedMessage);
  
        
        setMessages((prev) => [...prev, normalizedMessage]);
      });
  
      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAdmin]);

  const sendMessage = () => {
    if (socket && input.trim()) {
      const message = { sender: isAdmin ? 'Admin' : 'Usuario', content: input };
      socket.emit('chatToServer', message);
      console.log(message)
      setMessages((prev) => [...prev, message]);
      setInput('');
    }
  };

  if (isAdmin === null) {
   
    return <div>Cargando...</div>;
  }

  return (
<div style={styles.container}>
  <div style={styles.chatBox}>
    {messages.map((msg, index) => {
      console.log('Mensaje:', msg);
      console.log('Estructura completa del msg:', JSON.stringify(msg, null, 2));
      console.log('Tipo de content:', typeof msg.content);
      console.log('Content:', msg.content); 
      console.log('Sender:', msg.sender);
      console.log('Contenido del mensaje:', msg.content);  
      return (
        <div
          key={index}
          style={{
            ...styles.message,
            ...(msg.sender === (isAdmin ? 'Admin' : userId) ? styles.sent : styles.received),
          }}
        >
          <strong>{msg.sender}:</strong> {msg.content}
        </div>
      );
    })}
  </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    height: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  chatBox: {
    flex: 1,
    overflowY: 'auto' as 'auto',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  message: {
    margin: '5px 0',
    padding: '8px',
    borderRadius: '6px',
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7dd',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8d7da',
  },
  inputContainer: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '10px',
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ChatComponent;