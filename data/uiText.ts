import type { SupportedLanguageCode } from "@/data/wordCards";

type UiText = {
  clear: string;
  closed: string;
  combo: string;
  hint: string;
  inProgress: string;
  language: string;
  newGame: string;
  noImage: string;
  remaining: string;
  score: string;
  shuffle: string;
  status: string;
  subtitle: string;
  time: string;
  translationOff: string;
  translationOn: string;
  undo: string;
};

const en: UiText = {
  clear: "Clear!",
  closed: "Off",
  combo: "Combo",
  hint: "Hint",
  inProgress: "Playing",
  language: "Language",
  newGame: "New",
  noImage: "Image coming",
  remaining: "Cards",
  score: "Score",
  shuffle: "Shuffle",
  status: "Status",
  subtitle: "Find matching open Korean word cards.",
  time: "Time",
  translationOff: "Translation Off",
  translationOn: "Translation On",
  undo: "Undo",
};

export const UI_TEXT: Record<SupportedLanguageCode, UiText> = {
  en,
  ja: {
    ...en,
    clear: "クリア！",
    combo: "コンボ",
    hint: "ヒント",
    inProgress: "進行中",
    language: "言語",
    newGame: "新規",
    noImage: "画像準備中",
    remaining: "残り",
    score: "点数",
    shuffle: "シャッフル",
    status: "状態",
    subtitle: "開いている同じ韓国語カードを探しましょう。",
    time: "時間",
    translationOff: "翻訳 オフ",
    translationOn: "翻訳 オン",
    undo: "戻す",
  },
  zh: {
    ...en,
    clear: "完成！",
    combo: "连击",
    hint: "提示",
    inProgress: "进行中",
    language: "语言",
    newGame: "新游戏",
    noImage: "图片准备中",
    remaining: "剩余",
    score: "分数",
    shuffle: "洗牌",
    status: "状态",
    subtitle: "找出可打开的相同韩语词卡。",
    time: "时间",
    translationOff: "翻译 关",
    translationOn: "翻译 开",
    undo: "撤销",
  },
  fr: {
    ...en,
    clear: "Réussi !",
    combo: "Combo",
    hint: "Indice",
    inProgress: "En cours",
    language: "Langue",
    newGame: "Nouveau",
    noImage: "Image bientôt",
    remaining: "Cartes",
    score: "Score",
    shuffle: "Mélanger",
    status: "État",
    subtitle: "Trouvez deux cartes coréennes identiques ouvertes.",
    time: "Temps",
    translationOff: "Traduction non",
    translationOn: "Traduction oui",
    undo: "Annuler",
  },
  es: {
    ...en,
    clear: "¡Completado!",
    hint: "Pista",
    inProgress: "Jugando",
    language: "Idioma",
    newGame: "Nuevo",
    noImage: "Imagen pronto",
    remaining: "Cartas",
    score: "Puntos",
    shuffle: "Mezclar",
    status: "Estado",
    subtitle: "Busca dos tarjetas coreanas abiertas iguales.",
    time: "Tiempo",
    translationOff: "Traducción no",
    translationOn: "Traducción sí",
    undo: "Deshacer",
  },
  ar: { ...en, language: "اللغة", translationOn: "الترجمة تشغيل", translationOff: "الترجمة إيقاف" },
  mn: { ...en, language: "Хэл", translationOn: "Орчуулга асаалттай", translationOff: "Орчуулга унтраалттай" },
  vi: {
    ...en,
    clear: "Hoàn thành!",
    hint: "Gợi ý",
    inProgress: "Đang chơi",
    language: "Ngôn ngữ",
    newGame: "Mới",
    noImage: "Sắp có hình",
    remaining: "Thẻ",
    score: "Điểm",
    shuffle: "Xáo",
    status: "Trạng thái",
    subtitle: "Tìm hai thẻ từ tiếng Hàn giống nhau.",
    time: "Thời gian",
    translationOff: "Dịch tắt",
    translationOn: "Dịch bật",
    undo: "Hoàn tác",
  },
  th: { ...en, language: "ภาษา", translationOn: "แปล เปิด", translationOff: "แปล ปิด" },
  ru: {
    ...en,
    clear: "Готово!",
    hint: "Подсказка",
    inProgress: "Игра",
    language: "Язык",
    newGame: "Новая",
    noImage: "Изображение скоро",
    remaining: "Карты",
    score: "Счёт",
    shuffle: "Перемешать",
    status: "Статус",
    time: "Время",
    translationOff: "Перевод выкл.",
    translationOn: "Перевод вкл.",
    undo: "Отмена",
  },
  id: { ...en, language: "Bahasa", translationOn: "Terjemahan aktif", translationOff: "Terjemahan mati" },
  zhHant: { ...en, language: "語言", translationOn: "翻譯 開", translationOff: "翻譯 關" },
  uz: { ...en, language: "Til", translationOn: "Tarjima yoqilgan", translationOff: "Tarjima o‘chgan" },
  kk: { ...en, language: "Тіл", translationOn: "Аударма қосулы", translationOff: "Аударма өшірулі" },
  ky: { ...en, language: "Тил", translationOn: "Котормо күйүк", translationOff: "Котормо өчүк" },
  ne: { ...en, language: "भाषा", translationOn: "अनुवाद खुला", translationOff: "अनुवाद बन्द" },
  my: { ...en, language: "ဘာသာစကား", translationOn: "ဘာသာပြန် ဖွင့်", translationOff: "ဘာသာပြန် ပိတ်" },
  km: { ...en, language: "ភាសា", translationOn: "បកប្រែ បើក", translationOff: "បកប្រែ បិទ" },
  fil: { ...en, language: "Wika", translationOn: "Salin bukas", translationOff: "Salin sarado" },
  hi: { ...en, language: "भाषा", translationOn: "अनुवाद चालू", translationOff: "अनुवाद बंद" },
  bn: { ...en, language: "ভাষা", translationOn: "অনুবাদ চালু", translationOff: "অনুবাদ বন্ধ" },
  de: {
    ...en,
    clear: "Geschafft!",
    hint: "Tipp",
    inProgress: "Läuft",
    language: "Sprache",
    newGame: "Neu",
    noImage: "Bild folgt",
    remaining: "Karten",
    score: "Punkte",
    shuffle: "Mischen",
    status: "Status",
    subtitle: "Finde zwei gleiche offene koreanische Wortkarten.",
    time: "Zeit",
    translationOff: "Übersetzung aus",
    translationOn: "Übersetzung an",
    undo: "Zurück",
  },
  sw: { ...en, language: "Lugha", translationOn: "Tafsiri imewashwa", translationOff: "Tafsiri imezimwa" },
  ha: { ...en, language: "Harshe", translationOn: "Fassara kunne", translationOff: "Fassara kashe" },
};

export function getUiText(language: SupportedLanguageCode) {
  return UI_TEXT[language] ?? en;
}
