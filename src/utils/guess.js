import levensteihnDistance from "./levensteihnDistance";

const abbreviations = {
  bfmv: 'bullet for my valentine',
  brmc: 'black rebel motorcycle club',
  ccr: 'creedence clearwater revival',
  elo: 'electric light orchestra',
  fgth: 'frankie goes to hollywood',
  jsbx: 'the jon spencer blues explosion',
  mcr: 'my chemical romance',
  nkotb: 'new kids on the block',
  omd: 'orchestral manoeuvres in the dark',
  pusa: 'the presidents of the united states of america',
  qotsa: 'queens of the stone age',
  ratm: 'rage against the machine',
  rhcp: 'red hot chili peppers',
  soad: 'system of a down',
  stp: 'stone temple pilots',
  djvt: 'de jeugd van tegenwoordig',
  kka: 'kris kross amsterdam'
};

const checkGuess = (guess, title, fullArtists, titleGuessed, artistGuessed) => {
  if (titleGuessed && artistGuessed) {
    return ["That's enough, you already have both the title and artist!", titleGuessed, artistGuessed, 3];
  }

  fullArtists = fullArtists.split('(')[0].toLowerCase().trim();
  if (title.includes("feat.")) {
    fullArtists += ", " + title.split("feat.")[1].split(")")[0].trim();
  }

  title = title.split('(')[0].toLowerCase().trim();
  const artists = fullArtists.split(/[,&]+/).map((artist) => {
    return artist.trim().replaceAll('.', '');
  })
  guess = guess.split('(')[0].toLowerCase().trim();

  let resultList = ["Nope", "Think again", "You can do better", "What?"];

  if (levensteihnDistance(guess, title) < Math.round(Math.log2(title.length))) {
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
      if ((guess in abbreviations && artist === abbreviations[guess]) || levensteihnDistance(guess.replaceAll('.', ''), artist) < Math.round(Math.log2(artist.length))) {
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

export default checkGuess;