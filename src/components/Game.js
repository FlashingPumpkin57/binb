import '../style/Game.css';
import React from 'react';
import ReactPlayer from "react-player";
import {Box, Grid, TextField, Typography} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ProgressBar from "./ProgressBar";
import checkGuess from "../utils/guess";
import ChatBox from "./ChatBox";

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const getSong = (url) => {
  let response;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Access-Control-Allow-Origin', url);
  xhr.addEventListener("load", (requestResponse) => response = JSON.parse(
      requestResponse.target.response).results[0]);
  xhr.send();

  return {
    "artist": response.artistName,
    "title": response.trackName,
    "previewUrl": response.previewUrl,
    "artworkUrl": response.artworkUrl100
  }
}

const getUrl = (song) => {
  const corsUrlPrefix = "https://afternoon-anchorage-07164-401d62698654.herokuapp.com/"
  return corsUrlPrefix + "https://itunes.apple.com/us/lookup?id=" + song;
}

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      timeLeft: -500,
      pastSongs: [],
      roundPoints: 0,
      totalPoints: 0
    }
  }

  async componentDidMount() {
    let gameSongs;
    await import(`../songs${window.location.pathname}.json`).then(songs => gameSongs = Array.from(songs));
    shuffleArray(gameSongs);

    this.setState({ songs: gameSongs.slice(0, 10) })

    this.interval = setInterval(async () => {
      this.setState((state) => ({timeLeft: state.timeLeft - 1}));

      if (this.state.timeLeft === 0) {
        let pastSongs = this.state.pastSongs;
        if (pastSongs.filter(
            pastSong => pastSong.title === this.state.title && pastSong.artist
                === this.state.artist).length === 0) {
          pastSongs.unshift({
            title: this.state.title,
            artist: this.state.artist,
            artworkUrl: this.state.artworkUrl,
            points: this.state.roundPoints
          });
        }
        this.setState({pastSongs: pastSongs});

      } else if (this.state.timeLeft <= -500) {
        if (this.state.songs.length === 0) {
          let gameSongs;
          await import(`./songs${window.location.pathname}.json`).then(
              songs => {
                gameSongs = Array.from(songs);
                shuffleArray(gameSongs);

                this.setState({
                  timeLeft: -500,
                  pastSongs: [],
                  roundPoints: 0,
                  totalPoints: 0,
                  songs: gameSongs.slice(0, 10)
                });
              });
        } else {
          let newSongs = this.state.songs;
          const currentSong = newSongs.pop();
          const randomSongUrl = getUrl(currentSong);
          const {artist, title, previewUrl, artworkUrl} = getSong(randomSongUrl);

          this.setState({
            timeLeft: 3000,
            artist: artist,
            title: title,
            previewUrl: previewUrl,
            artworkUrl: artworkUrl,
            songs: newSongs,
            rewardText: null,
            titleGuessed: false,
            artistGuessed: false,
            guessedAt: null,
            resultText: null,
            totalPoints: this.state.totalPoints + this.state.roundPoints,
            roundPoints: 0
          });
        }
      }
    }, 10);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  render() {
    return (
        <Box p={10}>
          <Box mb={10}>
            <HomeOutlinedIcon className={'clickable'} style={{ position: 'absolute', top: '1rem', left: '1rem'}} onClick={() => window.location.href = '/'} />
            <ReactPlayer
                style={{display: 'none'}}
                url={this.state.previewUrl}
                playing
                volume={0.1}
            />
            <ProgressBar
                title={this.state.title}
                seconds={Math.round(this.state.timeLeft / 10) / 10}
            />
          </Box>
          <Typography style={{ marginBottom: '1rem' }}>{this.state.rewardText}</Typography>
          <TextField autoFocus variant={'outlined'} label={'Guess here'} disabled={this.state.titleGuessed && this.state.artistGuessed} onKeyDown={(e) => {
            if (this.state.title && e.code === "Enter") {
              const [guessText, titleGuessed, artistGuessed, roundPoints] = checkGuess(e.target.value, this.state.title, this.state.artist, this.state.titleGuessed, this.state.artistGuessed);
              this.setState({ rewardText: guessText, titleGuessed: titleGuessed, artistGuessed: artistGuessed, roundPoints: roundPoints, guessedAt: titleGuessed && artistGuessed ? 3000 - this.state.timeLeft : null });
              e.target.value = null;
            }}} />
          <Box mt={2}>
            <Typography>Points this round: {this.state.roundPoints}</Typography>
            <Typography>Total points: {this.state.totalPoints + this.state.roundPoints}</Typography>
            <Typography>Time: {this.state.guessedAt ? this.state.guessedAt / 100 + "s" : null}</Typography>
          </Box>
          <Grid container spacing={4} my={1}>
            <Grid item xs={6}>
              <Box id={'Results'} sx={{ border: 1, borderRadius: '10px' }} height={'50vh'} zIndex={1}>
                <Box mt={1} pb={1} display={'flex'} justifyContent={'center'} sx={{ borderBottom: 1 }} style={{ backgroundColor: 'white' }}>
                  <Typography variant={'h5'}>Past songs</Typography>
                </Box>
                <Box my={1} height={'43vh'} style={{ overflow: 'hidden', overflowY: 'scroll' }} zIndex={-1}>
                    {this.state.pastSongs.map(song =>
                      <Box key={song.title} m={2} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                        <Box display={'flex'} flexDirection={'row'}>
                          <img src={song.artworkUrl} alt={song.title} style={{ objectFit: 'cover' }} />
                          <Box m={2} ml={4}>
                            <Typography variant={'h5'}>{song.artist}</Typography>
                            <Typography variant={'h6'}>{song.title}</Typography>
                          </Box>
                        </Box>
                        <Box mr={2} mt={4}>
                          <Typography variant={'h6'}>
                            {song.points}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <ChatBox />
            </Grid>
          </Grid>
        </Box>
    );
  }
}

export default Game;
