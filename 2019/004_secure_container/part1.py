# Advent of Code - 2019
# Day 4 - Secure Container - Part 1


def is_valid_password(num):
    pair = False
    prev_num = num % 10
    num = num // 10
    while 0 < num:
        cur_num = num % 10
        if prev_num < cur_num:
            return False
        if cur_num == prev_num:
            pair = True
        prev_num = cur_num
        num = num // 10
    return True if pair else False


if __name__ == "__main__":
    valid_passwords = []

    for num in range(359282, 820402):
        if is_valid_password(num):
            valid_passwords.append(num)

    print(len(valid_passwords))
