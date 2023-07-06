const levenshteinDistance = (guess = '', actual = '') => {
  const track = Array(actual.length + 1).fill(null).map(() =>
      Array(guess.length + 1).fill(null));
  for (let i = 0; i <= guess.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= actual.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= actual.length; j += 1) {
    for (let i = 1; i <= guess.length; i += 1) {
      const indicator = guess[i - 1] === actual[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  return track[actual.length][guess.length];
};

export default levenshteinDistance;