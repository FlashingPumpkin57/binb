import {Box, Typography} from "@mui/material";
import React from "react";

const PastSongs = ({ songs }) => {
  return (
      <Box id={'Results'}>
        <Box py={1} mb={1} display={'flex'} justifyContent={'center'} sx={{ border: 1, borderRadius: '10px' }}>
          <Typography variant={'h5'}>Past songs</Typography>
        </Box>
        <Box height={'40vh'} mb={2} sx={{ border: 1, borderRadius: '10px' }}>
          <Box height={'38vh'} m={1} style={{ overflow: 'hidden', overflowY: 'scroll' }}>
            {songs.map(song =>
              <Box key={song.title} m={1} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                  <img src={song.artworkUrl} alt={song.title} style={{ objectFit: 'cover', height: '100px', width: '100px', borderRadius: '10px' }} />
                  <Box m={2} ml={4}>
                    <Typography variant={'h5'}>{song.artist}</Typography>
                    <Typography variant={'h6'}>{song.title}</Typography>
                  </Box>
                </Box>
                <Box mr={2} display={'flex'} alignItems={'center'}>
                  <Typography variant={'h6'}>
                    {song.points}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
  );
}

export default PastSongs;