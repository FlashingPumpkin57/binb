import {Box, Typography} from "@mui/material";
import React from "react";

function ProgressBar({title, seconds}) {
  seconds = Math.round((seconds * 100) / 100);
  const progressBar = seconds > 0 ?
      <Box key={title} className={'progressBarIncreasing'} gridRow={1} gridColumn={1} />
      : seconds === -5 ?
          null
          :
          <Box key={title} className={'progressBarDecreasing'} gridRow={1} gridColumn={1} />;

  return (
      <Box
          height={'1rem'}
          // width={'30%'}
          display={'flex'}
          flexDirection={'row'}
      >
        <Box display={'grid'} width={'100%'}>
          <Box className={'progressBarBackground'} gridRow={1} gridColumn={1} />
          {progressBar}
        </Box>
        <Box ml={2} width={'3%'}>
          <Typography style={{fontSize: '80%', width: '100%', color: 'teal', fontWeight: 'bold'}}>
            {seconds > -5 ? seconds > 0 ? seconds : 5 + seconds : null}
          </Typography>
        </Box>
      </Box>
  );
}

export default ProgressBar;