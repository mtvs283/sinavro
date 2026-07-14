import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "audio", "korean");
const MAIN_DATA_PATH = path.join(ROOT, "data", "wordCards.ts");
const EXTRA_DATA_PATH = path.join(ROOT, "data", "extraWordCards.ts");
const LOCAL_ENV_PATH = path.join(ROOT, ".env.local");
const DEFAULT_ENV_PATH = path.join(
  process.env.USERPROFILE ?? "",
  "OneDrive",
  "문서",
  "New project",
  "번역기",
  ".env",
);
const VOICES = {
  female: "ko-KR-Standard-A",
  male: "ko-KR-Standard-C",
};
const FORCE = process.argv.includes("--force");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/u)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/u);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/u, "$2");
  }
}

function extract(text, start, end) {
  const from = text.indexOf(start) + start.length;
  return text.slice(from, text.indexOf(end, from));
}

function loadActiveCards() {
  const mainText = fs.readFileSync(MAIN_DATA_PATH, "utf8");
  const extraText = fs.readFileSync(EXTRA_DATA_PATH, "utf8");
  const excludedSource = extract(
    mainText,
    "const EXCLUDED_KOREAN_WORDS = new Set(",
    ");\n\nconst ALL_WORD_CARDS",
  ).replace(/,\s*\]$/u, "]");
  const excluded = new Set(JSON.parse(excludedSource));
  const mainCards = JSON.parse(
    extract(
      mainText,
      "const ALL_WORD_CARDS: WordCard[] = ",
      ";\n\nexport const WORD_CARDS",
    ),
  );
  const extraCards = JSON.parse(
    extract(extraText, "export const EXTRA_WORD_CARDS: WordCard[] = ", ";\n"),
  );

  return [...mainCards, ...extraCards].filter((card) => !excluded.has(card.korean));
}

async function synthesize(card, voice, apiKey) {
  const outputPath = path.join(OUTPUT_DIR, `${card.id}-${voice}.mp3`);
  if (!FORCE && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
    return "cached";
  }

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        input: { text: card.korean },
        voice: { languageCode: "ko-KR", name: VOICES[voice] },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`${card.korean} (${card.id}): ${response.status} ${message.slice(0, 1200)}`);
  }

  const result = await response.json();
  fs.writeFileSync(outputPath, Buffer.from(result.audioContent, "base64"));
  return "created";
}

async function main() {
  loadEnvFile(LOCAL_ENV_PATH);
  loadEnvFile(process.env.GOOGLE_TTS_ENV_PATH || DEFAULT_ENV_PATH);
  const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_TTS_API_KEY 또는 GOOGLE_TRANSLATE_API_KEY가 필요합니다.");
  }

  const cards = loadActiveCards();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  let created = 0;
  let cached = 0;
  let completed = 0;
  const total = cards.length * Object.keys(VOICES).length;

  for (const card of cards) {
    for (const voice of Object.keys(VOICES)) {
      const status = await synthesize(card, voice, apiKey);
      if (status === "created") created += 1;
      else cached += 1;
      completed += 1;
      if (completed % 25 === 0 || completed === total) {
        console.log(`${completed}/${total}`);
      }
    }
  }

  console.log(
    JSON.stringify({ cards: cards.length, audioFiles: total, created, cached, output: OUTPUT_DIR }, null, 2),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
