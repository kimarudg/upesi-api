const dotenv = require('dotenv');

process.env.ENV_PATH
  ? dotenv.config({ path: process.env.ENV_PATH })
  : dotenv.config();

const configs = {
  type: 'postgres',
  host: process.env.PGHOST,
  port: Number.parseInt(process.env.PGPORT, 2),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  //   url: process.env.DATABASE_URL,

  entities: ['dist/**/*.model.js'],
  migrations: ['dist/core/modules/database/migrations/*.js'],
  cli: {
    migrationsDir: 'src/core/modules/database/migrations',
  },
};

if (process.env.NODE_ENV === 'production') {
  configs.ssl = {
    rejectUnauthorized: false,
  };
}
module.exports = {
  ...configs,
};
