// Модели ИИ, которыми пользуется кабинет.
//
// Вынесены отдельно, потому что их знают трое: распознавание наброска,
// генерация кадра и проверка ключа. Проверка обязана бить в ту же модель,
// что и работа, — иначе она отвечает «ключ работает» на ключе, которым
// ничего не работает.
//
// Модель — не константа, а настройка кабинета. Продукт уезжает RaxPro,
// у них свой ключ, свои лимиты и свой счёт: на объёме они захотят перевести
// распознавание на модель подешевле, а на сложных набросках вернуть сильную.
// Константы ниже — только значение по умолчанию.

export interface ModelChoice {
  id: string;
  title: string;
  note: string;
}

/** Anthropic. Идентификаторы полные, без суффикса даты: у семейства Claude 5
 *  дата в идентификатор не входит, и дописанная превращает его в несуществующий. */
export const ANTHROPIC_MODELS: ModelChoice[] = [
  { id: "claude-opus-5", title: "Claude Opus 5", note: "по умолчанию — лучше всех читает рукописный набросок" },
  { id: "claude-sonnet-5", title: "Claude Sonnet 5", note: "дешевле и быстрее, годится на чистых чертежах" },
  { id: "claude-haiku-4-5", title: "Claude Haiku 4.5", note: "самая дешёвая, на почерке ошибается" },
];

/** Google. Псевдоним, а не конкретная версия: конкретные версии Google
 *  снимает с новых ключей — `gemini-2.5-pro` уже отвечает 404 «no longer
 *  available to new users», то есть у RaxPro, заводящего ключ сегодня,
 *  ветка Google упала бы в первый же день. Псевдоним переживает поколение. */
export const GOOGLE_MODELS: ModelChoice[] = [
  { id: "gemini-pro-latest", title: "Gemini Pro (актуальный)", note: "по умолчанию — псевдоним, не устаревает" },
  { id: "gemini-flash-latest", title: "Gemini Flash (актуальный)", note: "дешевле и быстрее, точность ниже" },
];

export const ANTHROPIC_MODEL = ANTHROPIC_MODELS[0].id;
export const GOOGLE_MODEL = GOOGLE_MODELS[0].id;

/** Картиночная модель. Псевдонима у неё нет, поэтому держим текущую
 *  и запасную: если первая уедет из каталога, кадр всё равно соберётся. */
export const GOOGLE_IMAGE_MODELS = ["gemini-3-pro-image", "gemini-2.5-flash-image"] as const;

export function defaultModel(provider: "anthropic" | "google"): string {
  return provider === "anthropic" ? ANTHROPIC_MODEL : GOOGLE_MODEL;
}

/** Выбор из списка, а не свободная строка. Опечатка в идентификаторе
 *  превращается в 404 у менеджера при клиенте, а не в понятную ошибку. */
export function isKnownModel(provider: "anthropic" | "google", id: unknown): id is string {
  const list = provider === "anthropic" ? ANTHROPIC_MODELS : GOOGLE_MODELS;
  return typeof id === "string" && list.some((m) => m.id === id);
}

export function modelsFor(provider: "anthropic" | "google"): ModelChoice[] {
  return provider === "anthropic" ? ANTHROPIC_MODELS : GOOGLE_MODELS;
}
