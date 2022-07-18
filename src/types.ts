const sharedTypes = {
  AsyncDatabaseConnection: Symbol('AsyncDatabaseConnection'),
  EntityManager: Symbol('EntityManager'),
  QueryRunner: Symbol('QueryRunner'),
  WinstonLogger: Symbol('WinstonLogger'),
};

const serviceTypes = {
  MailService: Symbol('MailService'),
  UserService: Symbol('UserService'),
  AuthService: Symbol('AuthService'),
  LoggerService: Symbol('LoggerService'),
  BankAccountService: Symbol('BankAccountService'),
  BankAccountStatementService: Symbol('BankAccountStatementService'),
};

const repositoryTypes = {
  BankAccountRepository: Symbol('BankAccountRepository'),
};
const ERROR_CODES = {
  InvalidParameterError: 422,
  PermissionError: 401,
  ResourceNotFoundError: 404,
};

const TYPES = {
  ...sharedTypes,
  ...serviceTypes,
  ...repositoryTypes,
  ERROR_CODES,
};
export { TYPES };
