import { IEnvConfig } from '../models/env-config';

export const Config: IEnvConfig = {
  SUPPORTED_LANGUAGES: [
    {
      code: 'ru',
      title: 'shared.footer.languages.ru'
    },
    {
      code: 'ua',
      title: 'shared.footer.languages.ua'
    },
    {
      code: 'en',
      title: 'shared.footer.languages.en'
    }
  ],
  DEFAULT_LANGUAGE: 'ua',
  IMG_PATH: 'https://api.easypay.ua:505/',
  // API: 'http://sandbox.easypay.ua:8084/api',
  // API: 'https://preapi.easypay.ua:490/api',
  API: 'https://api.easypay.ua/api',
  ENV: 'DEV',
  PARTNER_API: 'https://api.superdeal.ua/v1',
  PARTNER_API_KEY: 'c4b8c72b1e'
};
export const Version = '1';
