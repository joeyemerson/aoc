import run from 'aocrunner';
import exp from 'constants';

const parseInput = (rawInput) => {
    return rawInput.split('\n').map((row) => row.split(' '));
};

/*
The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
*/
const scoreMap = { A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3 };
const winMap = { A: 'Z', B: 'X', C: 'Y', X: 'C', Y: 'A', Z: 'B' };

const getRoundScore = (a, b) => {
    let scoreA = scoreMap[a];
    let scoreB = scoreMap[b];
    if (winMap[a] === b) scoreA += 6;
    else if (winMap[b] === a) scoreB += 6;
    else {
        scoreA += 3;
        scoreB += 3;
    }
    return [scoreA, scoreB];
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    return input.reduce((acc, cur) => acc + getRoundScore(...cur)[1], 0);
};

//X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.
const part2 = (rawInput) => {
    const expectedScoreRanges = { X: [1, 3], Y: [4, 6], Z: [7, 9] };
    const input = parseInput(rawInput);
    return input.reduce((acc, [aChoice, bStrategy]) => {
        const possibleScores = ['X', 'Y', 'Z'].map((bChoice) => {
            return getRoundScore(aChoice, bChoice);
        });
        const match = possibleScores.find(([aScore, bScore]) => {
            const [start, end] = expectedScoreRanges[bStrategy];
            return bScore >= start && bScore <= end;
        });
        return acc + match[1];
    }, 0);
};

run({
    part1: {
        tests: [
            {
                input: `A Y
B X
C Z`,
                expected: 15,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `A Y
B X
C Z`,
                expected: 12,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
