# Advent of Code - 2019
# Day 1 - Part 1

import os


def fuel_counter_upper(module):
    return module // 3 - 2


total_fuel = 0
path = os.path.dirname(os.path.abspath(__file__))

with open(path + "/input.txt") as f:
    for line in f:
        total_fuel += fuel_counter_upper(int(line))

if __name__ == "__main__":
    print(total_fuel)
