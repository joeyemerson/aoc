# Advent of Code - 2019
# Day 4 - Secure Container - Part 2

from collections import Counter
from part1 import is_valid_password

valid_passwords = []

for num in range(359282, 820402):
    if is_valid_password(num):
        valid_passwords.append(num)

count = len(valid_passwords)

for pw in valid_passwords:
    digit_counts = Counter(str(pw))
    if 2 not in digit_counts.values():
        count = count - 1

print(count)
