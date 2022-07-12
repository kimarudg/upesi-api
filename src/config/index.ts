import * as joi from '@hapi/joi';
import * as dotenv from 'dotenv';

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

export const validEnvironments = ['development', 'production', 'qa', 'staging'];

// validating environment variables
const envVarsSchema = joi
  .object({
    PORT: joi.number().default('5030'),
    NODE_ENV: joi
      .string()
      .valid(...validEnvironments)
      .required(),
    DEVELOPMENT_START_COMMAND: joi.string().default('yarn start:dev'),
    LOG_LEVEL: joi
      .string()
      .valid(...['error', 'warning', 'info', 'debug', 'silly'])
      .default('silly'),

    JWT_SECRET_KEY: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),

    // APP Details
    APP_DESCRIPTION: joi.string().required(),
    APP_TITLE: joi.string().required(),

    // database config
    PGHOST: joi.string().required(),
    PGUSER: joi.string().required(),
    PGPASSWORD: joi.string().required(),
    PGDATABASE: joi.string().required(),
    PGPORT: joi.number().port().required().default(5432),
    DATABASE_LOGGING: joi
      .boolean()
      .truthy('TRUE')
      .truthy('true')
      .falsy('FALSE')
      .falsy('false')
      .default(false),

    ALLOWED_IMAGES: joi.string().required(),
    ALLOWED_DOCS: joi.string().required(),
    API_VERSION: joi.string().required(),
    API_PREFIX: joi.string().required(),
    REDIS_PORT: joi.number().default('6379'),
    REDIS_DB_INDEX: joi.number().default('0'),
    REDIS_HOST: joi.string(),
    WELCOME_EMAIL_SUBJECT: joi.string().default('Welcome Email'),
    FRONTEND_URL: joi.string().required(),
    EMAIL_FROM: joi.string().required(),
    EMAIL_UNSUBSCRIPTION: joi.string().required(),
    CORS_ORIGIN: joi.string().required(),
    CORS_METHODS: joi.string().required(),
    EMAIL_ADDRESS: joi.string().required(),
    EMAIL_PASS: joi.string().required(),
    EMAIL_HOST: joi.string().required(),
    EMAIL_PORT: joi.string().required(),
    EMAIL_CIPHERS: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  env: envVars.NODE_ENV,
  url: envVars.APP_URL,
  port: envVars.APP_PORT,
  logLevel: envVars.LOG_LEVEL,
  frontEndUrl: envVars.FRONTEND_URL,
  app: {
    title: envVars.APP_TITLE,
    description: envVars.APP_DESCRIPTION,
  },
  jwt: {
    secret: envVars.JWT_SECRET_KEY,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
  cors: {
    origin: envVars.CORS_ORIGIN.split(' '),
    methods: envVars.CORS_METHODS,
  },
  db: {
    host: envVars.PGHOST,
    username: envVars.PGUSER,
    password: envVars.PGPASSWORD,
    name: envVars.PGDATABASE,
    port: Number.parseInt(envVars.PGPORT, 2),
    logging: envVars.DATABASE_LOGGING,
  },
  isDevelopment:
    envVars.NODE_ENV === 'test' || envVars.NODE_ENV === 'development',
  uploads: {
    allowedImages: envVars.ALLOWED_IMAGES,
    allowedDocs: envVars.ALLOWED_DOCS,
  },
  api: {
    prefix: envVars.API_PREFIX,
    version: envVars.API_VERSION,
    url: `${envVars.API_PREFIX}/${envVars.API_VERSION}`,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    username: envVars.REDIS_USER,
    password: envVars.REDIS_PASS,
    dbIndex: envVars.REDIS_DB_INDEX,
  },
  mail: {
    defaultFrom: envVars.EMAIL_FROM,
    welcomeEmailSubject: envVars.WELCOME_EMAIL_SUBJECT,
    unsubscriptionEmail: envVars.EMAIL_UNSUBSCRIPTION,
    email: envVars.EMAIL_ADDRESS,
    password: envVars.EMAIL_PASS,
    host: envVars.EMAIL_HOST,
    port: envVars.EMAIL_PORT,
    ciphers: envVars.EMAIL_CIPHERS,
  },
};
