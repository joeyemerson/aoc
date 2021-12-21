const Player = function (position, boardSize) {
  let score = 0;

  return {
    move: numSpaces => {
      position = (position + numSpaces) % boardSize;
      score += position + 1;
    },
    getScore: () => {
      return score;
    },
  };
};

const DeterministicDie = function (sides) {
  let value = 0;

  return {
    roll: times => {
      let rollTotal = 0;
      while (times > 0) {
        rollTotal += value + 1;
        value = (value + 1) % sides;
        --times;
      }
      return rollTotal;
    },
  };
};

const Game = function (playerPositions, boardSize, targetScore) {
  const players = playerPositions.map(position => new Player(position, boardSize));
  const die = new DeterministicDie(100);
  const rollsPerPlayer = 3;
  let playerIdx = 0;

  return {
    isOver: () => {
      return players.some(player => player.getScore() >= targetScore);
    },
    play: () => {
      const player = players[playerIdx % players.length];
      player.move(die.roll(rollsPerPlayer));
      ++playerIdx;
    },
    getScores: () => {
      return players.map(player => player.getScore());
    },
    getTotalRolls: () => {
      return playerIdx * rollsPerPlayer;
    },
  };
};

// Part 1: Play a practice game using the deterministic 100-sided die. The moment either player wins,
// what do you get if you multiply the score of the losing player by the number of times the die was
// rolled during the game?
const p1 = (p1Start, p2Start, boardSize, targetScore) => {
  const game = new Game([p1Start, p2Start], boardSize, targetScore);
  while (!game.isOver()) game.play();
  const minScore = Math.min(...game.getScores());
  return minScore * game.getTotalRolls();
};

// Part 2: Using your given starting positions, determine every possible outcome.
// Find the player that wins in more universes; in how many universes does that player win?
const p2 = (p1Start, p2Start, boardSize, targetScore) => {
  // This is used to batch recursive calls for all possible ways a player can move n spaces
  const rolls = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]]; //prettier-ignore

  const go = (p1Score, p1Position, p2Score, p2Position, memo) => {
    if (p1Score >= targetScore) return [1, 0];
    if (p2Score >= targetScore) return [0, 1];

    const key = p1Score + ' ' + p1Position + ' ' + p2Score + ' ' + p2Position;

    if (!(key in memo)) {
      let p1Wins = 0;
      let p2Wins = 0;

      for (const [posOffset, weight] of rolls) {
        // p1 is always the current player
        const newPos = (p1Position + posOffset) % boardSize;
        // swap players each turn
        const [p2AddWins, p1AddWins] = go(p2Score, p2Position, p1Score + newPos + 1, newPos, memo);
        p1Wins += p1AddWins * weight;
        p2Wins += p2AddWins * weight;
      }

      memo[key] = [p1Wins, p2Wins];
    }

    return memo[key];
  };

  const [p1Wins, p2Wins] = go(0, p1Start, 0, p2Start, {});
  return Math.max(p1Wins, p2Wins);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(6, 1, 10, 1000));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(6, 1, 10, 21));
console.timeEnd('Part 2 Time');
