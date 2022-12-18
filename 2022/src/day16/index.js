import run from 'aocrunner';

const parseInput = (rawInput) => {
    const valves = [];
    const map = {};
    let start;
    for (const line of rawInput.split('\n')) {
        const [valveId, rate, ...edges] = line.match(/\d+|\b[A-Z]{2}\b/g);
        const valve = { valveId, rate: parseInt(rate), edges };
        if (valveId !== 'AA') valves.push(valve);
        else start = valve;
    }
    valves.sort((a, b) => b.rate - a.rate);
    valves.unshift(start);
    for (let i = 0; i < valves.length; ++i) {
        map[valves[i].valveId] = i;
    }
    const graph = [];
    const rates = [];
    for (let i = 0; i < valves.length; ++i) {
        graph.push(valves[i].edges.map((e) => map[e]));
        rates.push(valves[i].rate);
    }
    return [graph, rates];
};

const solve = (graph, rates, allottedTime, otherPlayers) => {
    const cache = {};
    let valveStates = 0;
    const dfs = (valve, time, players) => {
        if (time === 0) {
            return players === 0 ? 0 : dfs(0, allottedTime, players - 1);
        }
        const key =
            valveStates * graph.length * (allottedTime + 1) * (otherPlayers + 1) +
            valve * (allottedTime + 1) * (otherPlayers + 1) +
            time * (otherPlayers + 1) +
            players;
        if (cache.hasOwnProperty(key)) {
            return cache[key];
        }
        let max = 0;
        // I can either turn the valve on
        if (!(valveStates & (1 << valve)) && rates[valve] > 0) {
            valveStates |= 1 << valve;
            max = Math.max(max, rates[valve] * (time - 1) + dfs(valve, time - 1, players));
            valveStates ^= 1 << valve;
        }
        // or I can move
        for (const nv of graph[valve]) {
            max = Math.max(max, dfs(nv, time - 1, players));
        }
        return (cache[key] = max);
    };
    const result = dfs(0, allottedTime, otherPlayers);
    return result;
};

const part1 = (rawInput) => {
    const [graph, rates] = parseInput(rawInput);
    return solve(graph, rates, 30, 0);
};

const part2 = (rawInput) => {
    const [graph, rates] = parseInput(rawInput);
    return solve(graph, rates, 26, 1);
};

const testInput = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 1651,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 1707,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
