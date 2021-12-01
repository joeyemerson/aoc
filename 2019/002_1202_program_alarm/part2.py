# Advent of Code - 2019
# Day 2 - Part 2

import os
from part1 import get_program_output

path = os.path.dirname(os.path.abspath(__file__))
program = [int(x) for x in open(path + "/input.txt").readline().split(",")]
desired_result = 19690720

for i in range(100):
    for j in range(100):
        refreshed_program = list(program)
        if get_program_output(refreshed_program, i, j) == desired_result:
            print(f"{'=' * 40}\nCorrect Inputs\n{'=' * 40}\n"
                  + f"Noun: {i}\nVerb: {j}\nAnswer: {100 * i + j}")
            break
