import type { Language } from '../translations';

export function getLangText<T>(
  field: { en: T; [key: string]: any } | undefined,
  lang: Language
): T {
  if (!field) return '' as unknown as T;
  if (field[lang] !== undefined) {
    return field[lang] as T;
  }
  return field.en;
}
