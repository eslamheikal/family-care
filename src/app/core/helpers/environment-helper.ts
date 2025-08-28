import { environment as env } from '../../../environments/environment';

export class EnvironmentHelper {
  static readonly IS_PRODUCTION = env.production;
  static readonly API_URL = env.apiUrl;
  static readonly APP_NAME = 'Mesk-Edu';
}