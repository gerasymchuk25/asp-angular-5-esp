import { ILang } from './lang';

export interface IEnvConfig {
  API?: string;
  ENV?: string;
  SUPPORTED_LANGUAGES? :Array<ILang>;
  DEFAULT_LANGUAGE? : string;
  IMG_PATH?: string;
  PARTNER_API?: string;
  PARTNER_API_KEY?: string;
}
