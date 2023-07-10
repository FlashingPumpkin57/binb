import React, {useEffect} from "react";

import "../style/ChatRoom.css";
import useChat from "../utils/chat";
import {Box, Typography} from "@mui/material";
import StyledTextField from "../style/components/StyledTextField";

const ChatBox = () => {
  const roomId = window.location.pathname.split('/')[1]; // Gets roomId from URL
  const { messages, sendMessage } = useChat(roomId); // Creates a websocket and manages messaging
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

  return (
      <>
        <Box py={1} mb={1} display={'flex'} justifyContent={'center'} sx={{ border: 1, borderRadius: '10px' }}>
          <Typography variant={'h5'}>Chat</Typography>
        </Box>
        <Box height={'40vh'} mb={1} sx={{ border: 1, borderRadius: '10px' }}>
          <Box my={1} height={'31vh'} style={{overflow: 'hidden', overflowY: 'scroll'}}>
            {messages.map((message, i) => (
                <Box
                    key={i}
                    px={3}
                    py={1}
                    style={{ color: message.ownedByCurrentUser ? 'teal' : 'black' }}
                >
                  <b>{message.senderId}</b>: {message.body }
                </Box>
            ))}
          </Box>
          <Box width={'96%'} ml={'2%'}>
            <StyledTextField
                value={newMessage}
                fullWidth
                onChange={handleNewMessageChange}
                placeholder={'Write message...'}
                onKeyDown={(e) => {
                  if (newMessage.trim().length > 0 && e.code === "Enter") {
                    handleSendMessage();
                  }}}
            />
          </Box>
        </Box>

      </>
  );
};

export default ChatBox;