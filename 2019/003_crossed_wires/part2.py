# Advent of Code - 2019
# Day 3 - Part 2

import os

from collections import defaultdict

from part1 import get_all_coords, update_coords


def get_distances(instructions):
    cur_coords = (0, 0)
    distance = 0
    distances = defaultdict(int)
    for instruction in instructions:
        direction = instruction[0]
        limit = int(instruction[1:])
        while 0 < limit:
            cur_coords = update_coords(cur_coords, direction)
            distance = distance + 1
            if cur_coords in intersections:
                distances[cur_coords] += distance
            limit = limit - 1
    return distances


path = os.path.dirname(os.path.abspath(__file__))
wire_directions = open(path + "/input.txt").readlines()

wire_directions1 = wire_directions[0].split(",")
wire_directions2 = wire_directions[1].split(",")

coords1 = get_all_coords(wire_directions1)
coords2 = get_all_coords(wire_directions2)

intersections = set(x for x in coords1 if x in coords2)

distances1 = get_distances(wire_directions1)
distances2 = get_distances(wire_directions2)

min_distance = 0

for i in intersections:
    cur_distance = distances1[i] + distances2[i]
    if cur_distance < min_distance or min_distance == 0:
        min_distance = cur_distance

print(min_distance)
