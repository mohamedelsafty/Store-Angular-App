import { TranslatorService } from '@core/services/utilites/translate.service';

export function initializeApp(
  translationService: TranslatorService
): () => Promise<void> {
  return () =>
    new Promise((resolve) => {
      translationService.initLang();
      resolve();
    });
}
