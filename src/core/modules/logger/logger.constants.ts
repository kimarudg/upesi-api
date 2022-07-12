export enum LOGGER_LEVEL {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  SILLY = 'silly',
  PROFILE = 'profile',
}

export const SECRETS = {
  // tslint:disable-next-line: object-literal-key-quotes
  PASSWORD: ['password', 'PASSWORD', 'Password'],
  SECRET: ['secret'],
  API_KEY: ['api-key', 'api_key', 'API_KEY', 'API-KEY'],
};
