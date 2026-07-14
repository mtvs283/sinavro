from __future__ import annotations

import json
import re


text = open("data/wordCards.ts", encoding="utf-8").read()
words = re.findall(r'"korean": "([^"]+)"', text)
print(json.dumps(words[:15], ensure_ascii=False, indent=2))
