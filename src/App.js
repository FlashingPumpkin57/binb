import './App.css';
import React from 'react';
import ReactPlayer from "react-player";
import {Box, TextField, Typography} from "@mui/material";
import levensteihnDistance from "./levensteihnDistance";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

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

function ProgressBar({title, seconds}) {
  const progressBar = seconds > 0 ?
      <Box key={title} className={'progressBarIncreasing'} gridRow={1} gridColumn={1} />
      : seconds === -5 ?
          null
          :
          <Box key={title} className={'progressBarDecreasing'} gridRow={1} gridColumn={1} />;

  return (
  <Box
      height={'1rem'}
      width={'50%'}
      display={'flex'}
      flexDirection={'row'}
  >
    <Box display={'grid'} width={'100%'}>
      <Box className={'progressBarBackground'} gridRow={1} gridColumn={1} />
      {progressBar}
    </Box>
    <Box ml={2} width={'3%'}>
      <Typography style={{fontSize: '80%', width: '100%'}}>
        {seconds > -5 ? seconds > 0 ? seconds : 5 + seconds : null}
      </Typography>
    </Box>
  </Box>
  );
}

const checkGuess = (guess, title, fullArtists, titleGuessed, artistGuessed) => {
  title = title.split('(')[0].toLowerCase().trim();
  fullArtists = fullArtists.split('(')[0].toLowerCase().trim();
  const artists = fullArtists.split(/[,&]+/).map((artist) => {
    return artist.trim().replaceAll('.', '');
  })
  guess = guess.split('(')[0].toLowerCase().trim();

  let resultList = ["Nope", "Think again", "You can do better", "What?"];

  if (levensteihnDistance(guess, title) < Math.ceil(title.length / 4)) {
    if (titleGuessed) {
      resultList = ["You already got the title!"];
    } else {
      titleGuessed = true;
      resultList = ["Indeed!", "Good job!"];

      if (!artistGuessed) {
        resultList.push(...["Nice, do you also know the artist?", "Good, and what's the artist?", "That's the title!", "You got the title!"])
      } else {
        resultList.push(...["Good job, you got all points!", "Nice, you got both the title and artist!"])
      }
    }
  } else {
    artists.forEach(artist => {
      if (levensteihnDistance(guess.replaceAll('.', ''), artist) < Math.ceil(artist.length / 4)) {
        if (artistGuessed) {
          resultList = ["You already got the artist!"]
        } else {
          artistGuessed = true;
          resultList = ["Indeed!", "Good job!"];

          if (!titleGuessed) {
            resultList.push(...["Nice, do you also know the title?", "Good, and what's the title?", "That's the artist!", "You got the artist!"])
          } else {
            resultList.push(...["Good job, you got all points!", "Nice, you got both the title and artist!"])
          }
        }
      }
    })
  }

  // 0 if none guessed, 1 if either guessed, 3 if both guessed
  const points = Math.max(0, 3 - [!titleGuessed, !artistGuessed].filter(Boolean).length*2)

  return [resultList[Math.floor(Math.random() * resultList.length)], titleGuessed, artistGuessed, points];
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      timeLeft: -500,
      pastSongs: [],
      roundPoints: 0,
      totalPoints: 0
    }

    console.log(this.state.songs)
  }

  async componentDidMount() {
    let gameSongs;
    await import(`./songs${window.location.pathname}.json`).then(songs => gameSongs = Array.from(songs));
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
        <Box m={10}>
          <Box mb={10}>
            <HomeOutlinedIcon style={{ position: 'absolute', top: '1rem', left: '1rem'}} onClick={() => window.location.href = '/'} />
            <ReactPlayer
                style={{display: 'none'}}
                url={this.state.previewUrl}
                playing
                volume={0.1}
            />
            <ProgressBar
                title={this.state.title}
                seconds={Math.round(this.state.timeLeft / 100)}
            />
          </Box>
          <Typography style={{ marginBottom: '1rem' }}>{this.state.rewardText}</Typography>
          <TextField variant={'outlined'} label={'Guess here'} disabled={this.state.titleGuessed && this.state.artistGuessed} onKeyDown={(e) => {
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
          <Box id={'Results'} sx={{ border: 1 }} mt={3} minHeight={'5rem'}>
            {this.state.pastSongs.map(song =>
                <Box key={song.title} m={2} display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                  <Box display={'flex'} flexDirection={'row'}>
                    <img src={song.artworkUrl} alt={song.title}/>
                    <Box m={2} ml={4}>
                      <Typography variant={'h5'}>{song.artist}</Typography>
                      <Typography variant={'h6'}>{song.title}</Typography>
                    </Box>
                  </Box>
                  <Box mr={5} mt={4}>
                    <Typography variant={'h6'}>
                      {`${song.points} point${song.points === 1 ? '' : 's'}`}
                    </Typography>
                  </Box>
                </Box>
            )}
          </Box>
        </Box>
    );
  }
}

export default App;
