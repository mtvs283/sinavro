from __future__ import annotations

import re

import openpyxl


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def display_word(value: str) -> str:
    return re.sub(r"\d+$", "", value)


def korean_syllable_count(value: str) -> int:
    return len(re.findall(r"[가-힣]", value))


workbook = openpyxl.load_workbook("data/translations-24.xlsx", read_only=True, data_only=True)
sheet = workbook["영어"]
rows = sheet.iter_rows(values_only=True)
headers = [clean(value) for value in next(rows)]
index = {header: position for position, header in enumerate(headers)}

count = 0
for row in rows:
    if clean(row[index["등급"]]) != "1급" or clean(row[index["품사"]]) != "명사":
        continue

    word = display_word(clean(row[index["어휘"]]))
    if korean_syllable_count(word) > 3:
        continue

    print(
        "\t".join(
            [
                clean(row[index["id"]]),
                word,
                clean(row[index["길잡이말"]]),
                clean(row[index["영어_단어"]]),
            ]
        )
    )
    count += 1
    if count >= 140:
        break
