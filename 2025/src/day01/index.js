import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let result = 0;
    let cur = 50;
    for (const line of input.split("\n")) {
        const dir = line[0];
        const clicks = parseInt(line.slice(1)) % 100;
        if (dir === "R") {
            cur = (cur + clicks) % 100;
        } else {
            cur = (100 + (cur - clicks)) % 100;
        }
        if (cur === 0) ++result;
    }
    return result.toString();
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let result = 0;
    let cur = 50;
    let prev = 50;
    for (const line of input.split("\n")) {
        const dir = line[0];
        const clicks = parseInt(line.slice(1));
        if (dir === "R") cur += clicks;
        else cur -= clicks;
        if (cur > 0) result += Math.floor(cur / 100);
        else result += Math.floor(Math.abs(cur) / 100) + (prev !== 0 ? 1 : 0);
        cur = ((cur % 100) + 100) % 100;
        prev = cur;
        // console.log(line, cur, result);
    }
    return result.toString();
};

run({
    part1: {
        tests: [
            {
                input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
                expected: "3",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
                expected: "6",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
