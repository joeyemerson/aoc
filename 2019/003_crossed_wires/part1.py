# Advent of Code - 2019
# Day 3 - Part 1

import os


def update_coords(coords, direction):
    if direction == "U":
        return (coords[0], coords[1] + 1)
    elif direction == "R":
        return (coords[0] + 1, coords[1])
    elif direction == "D":
        return (coords[0], coords[1] - 1)
    else:
        return (coords[0] - 1, coords[1])


def get_all_coords(instructions):
    cur_coords = (0, 0)
    all_coords = set()
    for instruction in instructions:
        direction = instruction[0]
        limit = int(instruction[1:])
        while 0 < limit:
            cur_coords = update_coords(cur_coords, direction)
            all_coords.add(cur_coords)
            limit = limit - 1
    return all_coords


if __name__ == "__main__":
    path = os.path.dirname(os.path.abspath(__file__))
    wire_directions = open(path + "/input.txt").readlines()
    coords1 = get_all_coords(wire_directions[0].split(","))
    coords2 = get_all_coords(wire_directions[1].split(","))
    distances = [abs(x[0]) + abs(x[1]) for x in coords1 if x in coords2]
    print(min(distances))
