import React, {useEffect} from "react";

import "../style/ChatRoom.css";
import useChat from "../utils/chat";
import {Box, styled, TextField, Typography} from "@mui/material";

//declare the const and add the material UI style
const CssTextField = styled(TextField)({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'red',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'yellow',
      },
    },
  },
});

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
      <Box height={'25rem'}>
        <Box height={'100%'} mb={2} sx={{ border: 1, borderRadius: '10px' }}>
          <Box py={1} display={'flex'} justifyContent={'center'} sx={{ borderBottom: 1 }}>
            <Typography variant={'h5'}>Chat</Typography>
          </Box>
          <Box mt={1} height={'36vh'} style={{overflow: 'hidden', overflowY: 'scroll'}}>
            {messages.map((message, i) => (
                <Box
                    key={i}
                    px={3}
                    py={1}
                    style={{ color: message.ownedByCurrentUser ? 'royalblue' : 'black' }}
                >
                  <b>{message.senderId}</b>: {message.body }
                </Box>
            ))}
          </Box>
        </Box>
        <TextField
          value={newMessage}
          height={'22%'}
          fullWidth
          onChange={handleNewMessageChange}
          placeholder={'Write message...'}
          onKeyDown={(e) => {
            if (newMessage.trim().length > 0 && e.code === "Enter") {
              handleSendMessage();
            }}}
        />
      </Box>
  );
};

export default ChatBox;