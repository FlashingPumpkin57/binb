import '../style/Game.css';
import React from 'react';
import ReactPlayer from "react-player";
import {Box, Grid, Typography} from "@mui/material";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import ProgressBar from "./ProgressBar";
import checkGuess from "../utils/guess";
import ChatBox from "./ChatBox";
import PastSongs from "./PastSongs";
import StyledTextField from "../style/components/StyledTextField";
import {withTranslation} from "react-i18next";
import GrooveGuesserLogo from "../images/GrooveGuesserLogo.png"

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const getSong = (url) => {
  let response, result;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Access-Control-Allow-Origin', url);
  xhr.addEventListener("load", (requestResponse) => response = JSON.parse(
      requestResponse.target.response).results[0]);
  xhr.send();

  try {
    result = {
      "artist": response.artistName,
      "title": response.trackName,
      "previewUrl": response.previewUrl,
      "artworkUrl": response.artworkUrl100
    }
  } catch (e) {
    result = {
      "artist": "",
      "title": "",
      "previewUrl": "",
      "artworkUrl": ""
    }
  }

  return result;
}

const getUrl = (songId) => {
  const corsUrlPrefix = "https://afternoon-anchorage-07164-401d62698654.herokuapp.com/"
  return corsUrlPrefix + "https://itunes.apple.com/us/lookup?id=" + songId;
}

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      timeLeft: -500,
      songs: [],
      pastSongs: [],
      roundPoints: 0,
      totalPoints: 0
    }
  }

  async componentDidMount() {
    let allSongs;
    await import(`../songs${window.location.pathname}.json`).then(
        songs => allSongs = Array.from(songs));
    this.setState({allSongs: allSongs})

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
          const allSongs = this.state.allSongs;
          shuffleArray(allSongs);

          this.setState({
            timeLeft: -500,
            pastSongs: [],
            roundPoints: 0,
            totalPoints: 0,
            songs: allSongs.slice(0, 10)
          });
        } else {
          let newSongs = this.state.songs;
          const currentSong = newSongs.pop();
          const randomSongUrl = getUrl(currentSong);
          const {artist, title, previewUrl, artworkUrl} = getSong(
              randomSongUrl);

          this.setState({
            timeLeft: 3000,
            artist: artist,
            title: title,
            previewUrl: previewUrl,
            artworkUrl: artworkUrl,
            songs: newSongs,
            rewardText: "\t",
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
    const {t} = this.props;
    return (
        <Box p={10} pb={0}>
          <Box mb={4} display={'flex'} justifyContent={'space-between'}>
            <HomeOutlinedIcon className={'clickable'} style={{
              position: 'absolute',
              top: '2vh',
              left: '2vh',
              color: 'teal'
            }} onClick={() => window.location.href = '/'}/>
            <LanguageIcon className={'clickable'} style={{
              position: 'absolute',
              top: '2vh',
              right: '2vh',
              color: 'teal'
            }} onClick={() => this.props.i18n.changeLanguage(
                this.props.i18n.language === "en" ? "nl" : "en")}/>
            <Box id={'PlayerAndGuessInput'} width={'30%'} px={5}>
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
              <Typography style={{
                marginBottom: '1vh',
                marginTop: '1vh',
                height: '2rem'
              }}>{this.state.rewardText}</Typography>
              <StyledTextField autoFocus variant={'outlined'}
                               label={t("game.guessHere",
                                   {defaultValue: "Guess Here"})}
                               onKeyDown={(e) => {
                                 if (e.code === "Enter") {
                                   if (this.state.title && this.state.timeLeft
                                       >= 0) {
                                     const [guessText, titleGuessed, artistGuessed, roundPoints] = checkGuess(
                                         e.target.value, this.state.title,
                                         this.state.artist,
                                         this.state.titleGuessed,
                                         this.state.artistGuessed);
                                     this.setState({
                                       rewardText: guessText,
                                       titleGuessed: titleGuessed,
                                       artistGuessed: artistGuessed,
                                       roundPoints: roundPoints,
                                       guessedAt: this.state.guessedAt
                                           ? this.state.guessedAt : titleGuessed
                                           && artistGuessed ? 3000
                                               - this.state.timeLeft : null
                                     });
                                   }
                                   e.target.value = null;
                                 }
                               }}/>
              <Box mt={2}>
                <Typography>{t("game.roundPoints",
                        {defaultValue: "Points this round"}) + ": "
                    + this.state.roundPoints}</Typography>
                <Typography>{t("game.totalPoints",
                        {defaultValue: "Total points"}) + ": "
                    + (this.state.totalPoints
                        + this.state.roundPoints)}</Typography>
                <Typography>{t("game.time", {defaultValue: "Time"}) + ": "
                    + (this.state.guessedAt ? this.state.guessedAt / 100 + "s"
                        : "")}</Typography>
              </Box>
            </Box>
            <img src={GrooveGuesserLogo} alt={'Groove Guesser'} width={'40%'}
                 style={{
                   objectFit: 'contain',
                   position: 'absolute',
                   right: '15vw'
                 }}/>
          </Box>
          <Grid container spacing={4} my={1} position={'absolute'}
                bottom={'10%'} left={'5vw'} width={'90vw'}>
            <Grid item xs={6}>
              <PastSongs songs={this.state.pastSongs}/>
            </Grid>
            <Grid item xs={6}>
              <ChatBox/>
            </Grid>
          </Grid>
        </Box>
    );
  }
}

export default withTranslation()(Game);
