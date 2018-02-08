export class LoginData {
  id: number;
  email: string;
  password: string;
  errors: Array<any> = null;
  rememberMe: boolean = false;
  isValid: boolean = false;
  vCode?: string;

  private _phone: string = '';
  get phone(): string {
    return this._phone;
  }

  get purePhone(): string {
    return this._phone.trim().replace(/\+| |\(|\)|-/g, '');
  }

  set phone(value: string) {
    this._phone = value;
  }
}
