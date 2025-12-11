import run from "aocrunner";

const parseInput = (rawInput) => {
    return rawInput.split("\n").map((row) => {
        const groups = row.match(/[\(\[\{][\d,.#]+[\)\]\}]/g);
        const buttons = [];
        const joltage = [];
        let targetLights = 0;
        for (const g of groups) {
            const inner = g.slice(1, -1);
            if (g[0] === "[") targetLights = [...inner]
                .reduceRight((acc, cur) => acc * 2 + (cur === "#" ? 1 : 0), 0); //prettier-ignore
            else if (g[0] === "(") buttons.push(inner.split(",").map(Number));
            else if (g[0] === "{") joltage.push(...inner.split(",").map(Number)); //prettier-ignore
        }
        return { buttons, joltage, targetLights };
    });
};

const part1 = (rawInput) => {
    const machines = parseInput(rawInput);
    let result = 0;
    for (const { buttons, targetLights } of machines) {
        const queue = [[0, 0]];
        const pastStates = new Set();
        while (queue.length) {
            const [presses, curLights] = queue.shift();
            if (pastStates.has(curLights)) continue;
            pastStates.add(curLights);
            if (curLights === targetLights) {
                result += presses;
                break;
            }
            for (const button of buttons) {
                let nextLights = curLights;
                for (const pos of button) nextLights ^= 1 << pos;
                queue.push([presses + 1, nextLights]);
            }
        }
    }
    return result.toString();
};

const part2 = (rawInput) => {
    const machines = parseInput(rawInput);
    let result = 0;
    for (const { buttons, joltage } of machines) {
        const queue = [[0, Array(joltage.length).fill(0)]];
        const pastStates = new Set();
        while (queue.length) {
            const [presses, curJoltage] = queue.shift();
            if (presses > 12) continue;
            const str = curJoltage.join(",");
            if (pastStates.has(str)) continue;
            pastStates.add(str);
            if (curJoltage.every((val, idx) => val === joltage[idx])) {
                result += presses;
                break;
            }
            for (const button of buttons) {
                const nextJoltage = [...curJoltage];
                let isValid = true;
                for (const pos of button) {
                    if (++nextJoltage[pos] > joltage[pos]) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) queue.push([presses + 1, nextJoltage]);
            }
        }
    }
    return result.toString();
};

run({
    part1: {
        tests: [
            {
                input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
                expected: "7",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`,
                expected: "33",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
