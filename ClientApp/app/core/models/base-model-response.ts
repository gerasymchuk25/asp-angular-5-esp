export interface BaseModelResponse {
  error: ErrorModel;
}

export interface ErrorModel {
  errorCode: string;
  title: string;
  description: string;
  errorMessage: string;
  fieldErrors: FieldErrorModel[];
}

export interface FieldErrorModel {
  fieldName: string;
  errorCode: string;
  errorMessage: string;
}
