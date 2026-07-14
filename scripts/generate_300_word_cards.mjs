import fs from "node:fs";
import path from "node:path";

const SOURCE_DIR = "C:/Users/kodak/OneDrive/문서/New project/번역기";
const SOURCE_IMAGE_DIR = path.join(SOURCE_DIR, "images");
const OUTPUT_IMAGE_DIR = "public/cards/generated";
const OUTPUT_DATA_PATH = "data/wordCards.ts";
const OUTPUT_LIST_PATH = "data/selectedWords.json";
const CARD_COUNT = 300;

const EXISTING_IMAGES = {
  1: "/cards/shop.png",
  3: "/cards/furniture.png",
  7: "/cards/bag.png",
  9: "/cards/singer.png",
  17: "/cards/galbi.png",
  20: "/cards/persimmon.png",
  26: "/cards/dog.png",
  29: "/cards/living-room.png",
  32: "/cards/building.png",
  43: "/cards/meat.png",
  46: "/cards/cat.png",
  51: "/cards/park.png",
  52: "/cards/notebook.png",
  53: "/cards/airport.png",
  54: "/cards/fruit.png",
};

const LANGUAGE_CODES = {
  영어: "en",
  일본어: "ja",
  중국어: "zh",
  프랑스어: "fr",
  스페인어: "es",
  아랍어: "ar",
  몽골어: "mn",
  베트남어: "vi",
  타이어: "th",
  러시아어: "ru",
  인도네시아어: "id",
  중국어번체: "zhHant",
  우즈베크어: "uz",
  카자흐어: "kk",
  키르기스어: "ky",
  네팔어: "ne",
  버마어: "my",
  크메르어: "km",
  필리핀어: "fil",
  힌디어: "hi",
  벵골어: "bn",
  독일어: "de",
  스와힐리어: "sw",
  하우사어: "ha",
};

const ABSTRACT_WORDS = new Set([
  "가격", "가능성", "감정", "개념", "개인", "결과", "결정", "경험", "계획", "관계",
  "과거", "규칙", "기분", "기회", "기간", "날짜", "내용", "느낌", "마음", "미래",
  "방법", "번호", "부탁", "비밀", "사랑", "생활", "생각", "성격", "성공", "시간",
  "실수", "실패", "약속", "의미", "이유", "인기", "정보", "정도", "정신", "종류",
  "준비", "차이", "차례", "행동", "행복", "희망", "국적", "대답", "도착", "말씀",
  "맛", "문화", "구경", "공부", "뉴스", "가운데", "근처", "곳", "뒤", "밑", "밖",
  "반", "내년", "작년", "올해", "오늘", "내일", "어제", "요일", "월요일", "화요일",
  "수요일", "목요일", "금요일", "토요일", "일요일",
]);

const ABSTRACT_ENGLISH = /abstract|concept|feeling|emotion|mind|reason|method|relationship|result|information|meaning|chance|experience|decision|plan|possibility|degree|order|reply|arrival|nationality|culture|study|news/i;

function cleanWord(word) {
  return String(word ?? "").replace(/\d+$/u, "").trim();
}

function normalizeLanguage(language) {
  return language.replace(/\s+/gu, "");
}

function firstTranslation(value) {
  const text = String(value ?? "").trim();
  return text.split(/[;,。，]/u, 1)[0].trim() || text;
}

const vocab = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, "input_vocab.json"), "utf8"));
const progress = JSON.parse(
  fs.readFileSync(path.join(SOURCE_DIR, "translation_progress.json"), "utf8"),
);
const sourceImages = new Map(
  fs
    .readdirSync(SOURCE_IMAGE_DIR)
    .filter((name) => /^\d+_.+\.png$/u.test(name))
    .map((name) => [Number(name.match(/^(\d+)_/u)[1]), name]),
);

function buildTranslations(result) {
  const primary = Object.fromEntries(
    Object.entries(result?.translations ?? {}).map(([language, value]) => [
      normalizeLanguage(language),
      value,
    ]),
  );
  const additional = result?.["13개언어_단어번역"] ?? {};

  return Object.fromEntries(
    Object.entries(LANGUAGE_CODES).map(([language, code]) => {
      const primaryValue = primary[language];
      const additionalWord = additional[language];
      return [
        code,
        {
          language,
          word: String(primaryValue?.["단어"] ?? additionalWord ?? "").trim(),
          definition: String(primaryValue?.["뜻풀이"] ?? "").trim(),
        },
      ];
    }),
  );
}

function isCandidate(item) {
  if (!["1급", "2급"].includes(item["등급"]) || item["품사"] !== "명사") return false;

  const korean = cleanWord(item["어휘"]);
  const result = progress.results[String(item.id)];
  const translations = buildTranslations(result);
  const english = translations.en.word;
  const englishDefinition = translations.en.definition;

  return (
    korean.length > 0 &&
    korean.length <= 4 &&
    !ABSTRACT_WORDS.has(korean) &&
    !ABSTRACT_ENGLISH.test(englishDefinition) &&
    Boolean(english) &&
    Object.values(translations).every((translation) => Boolean(translation.word)) &&
    (Boolean(EXISTING_IMAGES[item.id]) || sourceImages.has(item.id))
  );
}

const forcedIds = new Set(Object.keys(EXISTING_IMAGES).map(Number));
const seenWords = new Set();
const selected = [];

for (const item of vocab.items) {
  if (!forcedIds.has(item.id)) continue;
  const korean = cleanWord(item["어휘"]);
  seenWords.add(korean);
  selected.push(item);
}

for (const item of vocab.items) {
  if (selected.length >= CARD_COUNT) break;
  const korean = cleanWord(item["어휘"]);
  if (forcedIds.has(item.id) || seenWords.has(korean) || !isCandidate(item)) continue;
  seenWords.add(korean);
  selected.push(item);
}

if (selected.length !== CARD_COUNT) {
  throw new Error(`Expected ${CARD_COUNT} cards, found ${selected.length}`);
}

fs.mkdirSync(OUTPUT_IMAGE_DIR, { recursive: true });

const cards = selected.map((item) => {
  const korean = cleanWord(item["어휘"]);
  const translations = buildTranslations(progress.results[String(item.id)]);
  let imageSrc = EXISTING_IMAGES[item.id];

  if (!imageSrc) {
    const sourceName = sourceImages.get(item.id);
    const outputName = `word-${item.id}.png`;
    const outputPath = path.join(OUTPUT_IMAGE_DIR, outputName);
    if (!fs.existsSync(outputPath)) {
      fs.copyFileSync(path.join(SOURCE_IMAGE_DIR, sourceName), outputPath);
    }
    imageSrc = `/cards/generated/${outputName}`;
  }

  return {
    id: `word-${item.id}`,
    korean,
    sourceWord: item["어휘"],
    level: item["등급"],
    partOfSpeech: item["품사"],
    category: "noun",
    guide: item["길잡이말"],
    imageSrc,
    imagePrompt: firstTranslation(translations.en.word),
    translations,
  };
});

const typeSource = `export type SupportedLanguageCode =\n${Object.values(LANGUAGE_CODES)
  .map((code) => `  | ${JSON.stringify(code)}`)
  .join("\n")};\n\nexport type WordCard = {\n  id: string;\n  korean: string;\n  sourceWord: string;\n  level: string;\n  partOfSpeech: string;\n  category: \"noun\" | \"verb\" | \"adjective\";\n  guide: string;\n  imageSrc?: string;\n  imagePrompt: string;\n  translations: Record<SupportedLanguageCode, { language: string; word: string; definition: string }>;\n};\n\nexport const DEFAULT_LANGUAGE: SupportedLanguageCode = \"en\";\n\nexport const WORD_CARDS: WordCard[] = ${JSON.stringify(cards, null, 2)};\n`;

fs.writeFileSync(OUTPUT_DATA_PATH, typeSource, "utf8");
fs.writeFileSync(
  OUTPUT_LIST_PATH,
  JSON.stringify(
    cards.map(({ id, imagePrompt, imageSrc, korean, level }) => ({
      id,
      korean,
      level,
      imagePrompt,
      imageSrc,
    })),
    null,
    2,
  ),
  "utf8",
);

console.log(
  JSON.stringify({ cards: cards.length, copiedImages: cards.length - forcedIds.size }, null, 2),
);
