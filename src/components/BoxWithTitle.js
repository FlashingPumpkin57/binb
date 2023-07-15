import {Box, Paper, Typography} from "@mui/material";
import React from "react";

const BoxWithTitle = ({ title, textInput = null, content = null }) => {
  return (
      <>
        <Box display={'flex'} justifyContent={'center'} width={'100%'} height={'5vh'}>
          <Typography variant={'h5'} style={{ color: 'teal' }}>{title}</Typography>
        </Box>
        <Box my={1}>
          <Paper elevation={10} variant={'outlined'} style={{ borderColor: 'teal' }}>
            <Box height={'40vh'} style={{overflow: 'hidden', overflowY: 'scroll'}}>
              {content}
            </Box>
          </Paper>
        </Box>
        {textInput}
      </>
  )
};

export default BoxWithTitle;