#include "../aoc.h"

int main() {
  int validPassportCount = 0;

  std::vector<std::string> requiredFields = {
    "byr:", "iyr:", "eyr:", "hgt:", "hcl:", "ecl:", "pid:"
  };

  std::ifstream newfile("input.txt", std::ios::in);
  if (newfile.is_open()) {
    std::string passport;
    std::string line;

    while(getline(newfile, line)) {
      if (!line.size()) {
        // loop through required fields and check if each is present in current passport
        // if one is not found, change isValid bool to false and break for next
        bool isValid = true;
        for (std::string field : requiredFields) {
          if(passport.find(field) == std::string::npos) {
            isValid = false;
            break;
          }
        }
        if (isValid) {
          ++validPassportCount;
          std::cout << passport << "\n\n";
        } else {
          std::cout << "INVALID" << "\n\n";
        }
        passport.clear(); // on blank line, clear for next passport to process
      } else {
        passport += line;
      }
    }

    newfile.close();
  }

  std::cout << validPassportCount << std::endl;

  return 0;
}
