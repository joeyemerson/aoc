import run from 'aocrunner';

const parseInput = (rawInput) => {
    const map = { ore: 0, clay: 1, obsidian: 2 };
    const blueprints = [];
    for (const line of rawInput.split('\n')) {
        const botInfo = line.split(': ')[1].split('. ');
        const maxSpend = [0, 0, 0, Infinity]; // no max spend for geode bots -- we always want more
        const blueprint = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; //prettier-ignore
        for (let bType = 0; bType < botInfo.length; ++bType) {
            const pairs = botInfo[bType].match(/\d+ \w+/g).map((p) => p.split(' '));
            for (const [val, type] of pairs) {
                blueprint[bType][map[type]] = parseInt(val);
                maxSpend[map[type]] = Math.max(maxSpend[map[type]], parseInt(val));
            }
        }
        blueprints.push([blueprint, maxSpend]);
    }
    return blueprints;
};

const solve = (time, resources, bots, bp, maxSpend, cache) => {
    if (time === 0) return resources[3];

    // we can't spend more than the max cost of a single resource * time remaining
    for (let i = 0; i < 3; ++i) {
        resources[i] = Math.min(resources[i], maxSpend[i] * time);
    }

    const key = `${time} ${resources.join(' ')} ${bots.join(' ')}`;

    if (cache.has(key)) {
        return cache.get(key);
    }

    // do nothing, just move on
    let max = resources[3] + bots[3] * time;

    for (let bType = 0; bType < bots.length; ++bType) {
        // try to build each robot if we don't already have the max amount
        if (bots[bType] < maxSpend[bType]) {
            // fast forward to a point at which we can build the robot (if possible)
            let waitTime = 0;
            let canBuild = true;
            for (let i = 0; i < 3; ++i) {
                if (bp[bType][i] === 0) continue;
                if (bots[i] === 0) {
                    canBuild = false;
                    break;
                }
                waitTime = Math.max(waitTime, Math.ceil((bp[bType][i] - resources[i]) / bots[i]));
            }
            if (!canBuild || waitTime + 1 >= time) continue;
            const _bots = [...bots];
            const _resources = resources.map((amt, idx) => amt - bp[bType][idx] + bots[idx] * (waitTime + 1));
            ++_bots[bType];
            max = Math.max(max, solve(time - waitTime - 1, _resources, _bots, bp, maxSpend, cache));
        }
    }

    cache.set(key, max);
    return max;
};

const part1 = (rawInput) => {
    const blueprints = parseInput(rawInput);
    let result = 0;
    for (let i = 0; i < blueprints.length; ++i) {
        const [bp, maxSpend] = blueprints[i];
        const maxGeodes = solve(24, [0, 0, 0, 0], [1, 0, 0, 0], bp, maxSpend, new Map());
        result += maxGeodes * (i + 1);
    }
    return result;
};

const part2 = (rawInput) => {
    const blueprints = parseInput(rawInput);
    let result = 1;
    for (let i = 0; i < Math.min(3, blueprints.length); ++i) {
        const [bp, maxSpend] = blueprints[i];
        const maxGeodes = solve(32, [0, 0, 0, 0], [1, 0, 0, 0], bp, maxSpend, new Map());
        result *= maxGeodes;
    }
    return result;
};

const testInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 33,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // {
            //     input: testInput,
            //     expected: 3472,
            // },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
