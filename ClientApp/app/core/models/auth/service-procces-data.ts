import { ServiceErrorField } from './service-error-field';

export class ServiceProcessData {
  successMessage: string = null;
  errors: Array<ServiceErrorField> = null;
}
