import run from "aocrunner";
import path from "path";

const parseInput = (rawInput) => {
    const graph = new Map();
    for (const row of rawInput.split("\n")) {
        const [from, tos] = row.split(": ");
        graph.set(from, []);
        for (const to of tos.split(" ")) {
            graph.get(from).push(to);
        }
    }
    return graph;
};

const part1 = (rawInput) => {
    const graph = parseInput(rawInput);
    const seen = new Set();
    const curPath = [];
    let uniquePaths = 0;
    const explore = (cur) => {
        if (cur === "out") {
            ++uniquePaths;
            return;
        }
        const pathStr = curPath.join("");
        if (seen.has(pathStr)) return;
        seen.add(pathStr);
        for (const next of graph.get(cur)) {
            curPath.push(next);
            explore(next);
            curPath.pop();
        }
    };
    explore("you");
    return uniquePaths.toString();
};

const part2 = (rawInput) => {
    const graph = parseInput(rawInput);
    const curPath = [];
    const seenPaths = new Set();
    const cache = new Map();
    const findAllPaths = (cur, dac, fft) => {
        if (cur === "out") {
            if (dac && fft) return 1;
            return 0;
        }
        const pathStr = curPath.join("");
        if (seenPaths.has(pathStr)) return;
        seenPaths.add(pathStr);
        if (cur === "dac") dac = 1;
        if (cur === "fft") fft = 1;
        if (!cache.has(cur)) cache.set(cur, [Array(2), Array(2)]);
        if (cache.get(cur)[dac][fft] === undefined) {
            let result = 0;
            for (const next of graph.get(cur)) {
                curPath.push(next);
                result += findAllPaths(next, dac, fft);
                curPath.pop();
            }
            cache.get(cur)[dac][fft] = result;
        }
        return cache.get(cur)[dac][fft];
    };
    return findAllPaths("svr", 0, 0).toString();
};

run({
    part1: {
        tests: [
            {
                input: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`,
                expected: "5",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
                expected: "2",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
