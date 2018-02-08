export class RegisterData {
  name: string = null;
  phone: string = '';
  password: string = null;
  confirmPassword: string = null;
  acceptLicense: boolean = false;
  code: string = null;
  errors: Array<any> = null;
  needConfirm: boolean = false;
  successMessage: string = null;
  redirectTimer: number = null;
}
