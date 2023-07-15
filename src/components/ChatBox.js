import React, {useEffect} from "react";

import "../style/ChatRoom.css";
import useChat from "../utils/chat";
import {Box} from "@mui/material";
import StyledTextField from "../style/components/StyledTextField";
import BoxWithTitle from "./BoxWithTitle";
import {useTranslation} from "react-i18next";

const ChatBox = () => {
  const roomId = window.location.pathname.split('/')[1]; // Gets roomId from URL
  const {messages, sendMessage} = useChat(roomId); // Creates a websocket and manages messaging
  const [newMessage, setNewMessage] = React.useState(""); // Message to be sent

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  useEffect(() => {

  });

  const {t} = useTranslation();

  return <BoxWithTitle
      title={'Chat'}
      textInput={
        <StyledTextField
            value={newMessage}
            fullWidth
            onChange={handleNewMessageChange}
            placeholder={t("game.writeMessage",
                {defaultValue: "Write message..."})}
            onKeyDown={(e) => {
              if (newMessage.trim().length > 0 && e.code === "Enter") {
                handleSendMessage();
              }
            }}
        />
      }
      content={messages.map((message, i) => (
          <Box
              key={i}
              px={3}
              py={1}
              style={{color: message.ownedByCurrentUser ? 'teal' : 'black'}}
          >
            <b>{message.senderId}</b>: {message.body}
          </Box>
      ))}
  />
};

export default ChatBox;