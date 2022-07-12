const sharedTypes = {
  AsyncDatabaseConnection: Symbol('AsyncDatabaseConnection'),
  CurrentUser: Symbol('CurrentUser'),
  EntityManager: Symbol('EntityManager'),
  IFixtures: Symbol('IFixtures'),
  QueryRunner: Symbol('QueryRunner'),
  WinstonTransport: Symbol('WinstonTransport'),
  WinstonLogger: Symbol('WinstonLogger'),
};

const serviceTypes = {
  MailService: Symbol('MailService'),
  JobsService: Symbol('JobsService'),
  TaskService: Symbol('TaskService'),
  FileService: Symbol('FileService'),
  ClientService: Symbol('ClientService'),
  AudioRatingService: Symbol('AudioRatingService'),
  AudioSplittingService: Symbol('AudioSplittingService'),
  UserService: Symbol('UserService'),
  AuthService: Symbol('AuthService'),
  RolesService: Symbol('RolesService'),
  PermissionService: Symbol('PermissionService'),
  LoggerService: Symbol('LoggerService'),
};

const repositoryTypes = {
  JobRepository: Symbol('JobRepository'),
  FileRepository: Symbol('FileRepository'),
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
