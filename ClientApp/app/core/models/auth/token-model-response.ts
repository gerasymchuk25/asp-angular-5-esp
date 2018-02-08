import { BaseModelResponse } from '../base-model-response';

export interface TokenModelResponse extends BaseModelResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  userId: string;
  userName: string;
  'as:client_id': string;
  '.issued': string;
  '.expires': string;
}
