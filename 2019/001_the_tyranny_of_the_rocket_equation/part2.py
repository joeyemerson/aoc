# Advent of Code - 2019
# Day 1 - Part 2

import os
from part1 import fuel_counter_upper

total_fuel = 0
path = os.path.dirname(os.path.abspath(__file__))

with open(path + "/input.txt") as f:
    for line in f:
        module_fuel = fuel_counter_upper(int(line))
        while 0 <= module_fuel:
            total_fuel += module_fuel
            module_fuel = fuel_counter_upper(module_fuel)

print(total_fuel)
