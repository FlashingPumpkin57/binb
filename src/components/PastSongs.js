import {Box, Typography} from "@mui/material";
import React from "react";
import BoxWithTitle from "./BoxWithTitle";
import {useTranslation} from "react-i18next";

const PastSongs = ({songs}) => {
  const {t} = useTranslation();

  return (
      <BoxWithTitle
          title={t('game.pastSongs')}
          content={
            <Box height={'38vh'} m={1} mr={0}
                 style={{overflow: 'hidden', overflowY: 'scroll'}}>
              {songs.map(song =>
                  <Box key={song.title} m={1} ml={2} display={'flex'}
                       flexDirection={'row'} justifyContent={'space-between'}>
                    <Box display={'flex'} flexDirection={'row'}
                         alignItems={'center'}>
                      <img src={song.artworkUrl} alt={song.title} style={{
                        objectFit: 'cover',
                        height: '100px',
                        width: '100px',
                        borderRadius: '10px'
                      }}/>
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
          }
      />
  );
}

export default PastSongs;