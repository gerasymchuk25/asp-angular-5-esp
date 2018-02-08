import { Category } from './category';
import { ServiceField } from './service-fields';

export interface Service {
  serviceKey: string;
  path: string;
  icon: string;
  amountMin: number;
  amountMax: number;
  caption: string;
  description: string;
  templateKey: string;
  pageTitle: string;
  pageDescription: string;
  index: number;
  weight: number;
  categoryKey: string;
  fields: Array<ServiceField>;
  enabled: boolean;
  category?: Category;
  pageSeoText?: string;
}
