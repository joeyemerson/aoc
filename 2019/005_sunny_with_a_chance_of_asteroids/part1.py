# Advent of Code - 2019
# Day 5 - Sunny with a Chance of Asteroids - Part 1

import os

path = os.path.dirname(os.path.abspath(__file__))
program = [int(x) for x in open(path + "/input.txt").readline().split(",")]


def get_program_output(program, noun, verb):
    program[1], program[2] = noun, verb

    for i in range(0, len(program), 4):
        op_code = program[i]
        num1 = program[i+1]
        num2 = program[i+2]
        destination = program[i+3]
        if op_code == 1:
            program[destination] = program[num1] + program[num2]
        elif op_code == 2:
            program[destination] = program[num1] * program[num2]
        else:
            break

    return program[0]


if __name__ == "__main__":
    print(get_program_output(program, 12, 2))