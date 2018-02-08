import { Category } from './category';
import { Service } from './service';

export class ServiceNode {
  categoryKey: string;
  name: string;
  description: string;
  icon: string;
  pageTitle: string;
  pageDescription: string;
  index: number;
  categories: Array<Category> = null;
  services: Array<Service> = null;
}


