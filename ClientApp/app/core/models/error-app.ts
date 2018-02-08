export interface IErrorApp {
  error: Error;
}

interface Error {
  errorCode: string;
  title: string;
  description: string;
  errorMessage: string;
  fieldErrors: any;
}
