import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n');

const generateFilesystem = (input) => {
    const fs = { '..': null };
    let cur = fs;
    for (const line of input) {
        if (line[0] === '$') {
            const [_, cmd, dest] = line.split(' ');
            if (cmd === 'cd') {
                if (dest === '/') cur = fs;
                else {
                    if (!cur[dest]) {
                        cur[dest] = {};
                        cur[dest]['..'] = cur;
                    }
                    cur = cur[dest];
                }
            }
        } else {
            const [dir, name] = line.split(' ');
            if (dir === 'dir') {
                if (!cur[name]) {
                    cur[name] = {};
                    cur[name]['..'] = cur;
                }
            } else {
                // dir is size of file
                cur[name] = parseInt(dir);
            }
        }
    }
    return fs;
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const fs = generateFilesystem(input);
    const sizeLimit = 100000;
    let sum = 0;
    const dfs = (folder) => {
        if (!folder) return 0;
        let size = 0;
        for (const name in folder) {
            if (typeof folder[name] === 'number') {
                size += folder[name];
            } else if (name !== '..') {
                size += dfs(folder[name]);
            }
        }
        if (size <= sizeLimit) sum += size;
        return size;
    };
    dfs(fs);
    return sum;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const totalSize = 70000000;
    const neededSpace = 30000000;
    const fs = generateFilesystem(input);
    const folderSizes = [];
    const dfs = (folder) => {
        if (!folder) return 0;
        let size = 0;
        for (const name in folder) {
            if (typeof folder[name] === 'number') {
                size += folder[name];
            } else if (name !== '..') {
                size += dfs(folder[name]);
            }
        }
        folderSizes.push(size);
        return size;
    };
    const usedSize = dfs(fs);
    const buffer = totalSize - usedSize;
    let deleteSize = Infinity;
    for (const curSize of folderSizes) {
        if (buffer + curSize >= neededSpace && curSize < deleteSize) deleteSize = curSize;
    }
    return deleteSize;
};

run({
    part1: {
        tests: [
            {
                input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
                expected: 95437,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
                expected: 24933642,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
