import run from 'aocrunner';

const parseInput = (rawInput) => {
    const points = [];
    let maxX = 0;
    let maxY = 0;
    let maxZ = 0;
    for (const line of rawInput.split('\n')) {
        const [x, y, z] = line.split(',').map(Number);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        maxZ = Math.max(maxZ, z);
        points.push([x, y, z]);
    }
    const grid = Array.from(Array(maxX + 1), () => {
        return Array.from(Array(maxY + 1), () => {
            return Array(maxZ + 1).fill(0);
        });
    });
    for (const [x, y, z] of points) {
        grid[x][y][z] = 1;
    }
    return grid;
};

const solve = (grid, part2) => {
    const X = grid.length;
    const Y = grid[0].length;
    const Z = grid[0][0].length;
    const dx = [1, -1, 0, 0, 0, 0];
    const dy = [0, 0, 1, -1, 0, 0];
    const dz = [0, 0, 0, 0, 1, -1];

    const canEscape = (x, y, z, visited) => {
        if (x < 0 || x === X || y < 0 || y === Y || z < 0 || z === Z) return true;
        if (visited[x][y][z] || grid[x][y][z]) return false;
        visited[x][y][z] = 1;
        for (let i = 0; i < 6; ++i) {
            const xx = x + dx[i];
            const yy = y + dy[i];
            const zz = z + dz[i];
            if (canEscape(xx, yy, zz, visited)) return true;
        }
        return false;
    };

    let result = 0;

    for (let x = 0; x < X; ++x) {
        for (let y = 0; y < Y; ++y) {
            for (let z = 0; z < Z; ++z) {
                if (!grid[x][y][z]) continue;
                for (let i = 0; i < 6; ++i) {
                    const xx = x + dx[i];
                    const yy = y + dy[i];
                    const zz = z + dz[i];
                    if (xx < 0 || xx === X || yy < 0 || yy === Y || zz < 0 || zz === Z || !grid[xx][yy][zz]) {
                        if (part2) {
                            const visited = Array.from(Array(X), () => {
                                return Array.from(Array(Y), () => {
                                    return Array(Z).fill(0);
                                });
                            });
                            if (canEscape(xx, yy, zz, visited)) ++result;
                        } else {
                            ++result;
                        }
                    }
                }
            }
        }
    }

    return result;
};

const part1 = (rawInput) => {
    const grid = parseInput(rawInput);
    return solve(grid, false);
};

const part2 = (rawInput) => {
    const grid = parseInput(rawInput);
    return solve(grid, true);
};

const testInput = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

run({
    part1: {
        tests: [
            {
                input: testInput,
                expected: 64,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: testInput,
                expected: 58,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
