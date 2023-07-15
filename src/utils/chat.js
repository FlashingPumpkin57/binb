import {useEffect, useRef, useState} from "react";
import socketIOClient from "socket.io-client";

const CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef([]);

  const [userName, setUserName] = useState("Guest");
  useEffect(() => {
    setUserName(prompt("What's your name?", "Guest"));
  }, [roomId]);

  useEffect(() => {

    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: {roomId},
    });

    // Listens for incoming messages
    socketRef.current.on(CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.socketId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: userName,
      socketId: socketRef.current.id
    });
  };

  return {messages, sendMessage};
};

export default useChat;