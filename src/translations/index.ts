import type { Language, Translations } from './types';
import { en } from './en';
import { hi } from './hi';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { ar } from './ar';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';
import { it } from './it';

export const translations: Record<Language, Translations> = {
  en,
  hi,
  es,
  fr,
  de,
  pt,
  ar,
  zh,
  ja,
  ko,
  ru,
  it,
};

export * from './types';
