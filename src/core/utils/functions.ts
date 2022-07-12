import { INestApplication } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { Chance } from 'chance';
import { get } from 'lodash';
import { config, validEnvironments } from '@app/config';

// adds xml options to bodyParser after import
// tslint:disable-next-line:no-var-requires
require('body-parser-xml')(bodyParser);

const chance = new Chance();

export function toBase64(inBase64: string): string {
  return Buffer.from(inBase64).toString('base64');
}

export function useBodyParsers(app: INestApplication): void {
  app.use(bodyParser.json());
  app.use(
    // tslint:disable-next-line:no-string-literal
    bodyParser['xml']({
      limit: '1MB', // Reject payload bigger than 1 MB
      xmlParseOptions: {
        normalize: true, // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false, // Only put nodes in array if >1
      },
    }),
  );
}

export function mockEnv(env: typeof validEnvironments[number]): void {
  beforeEach(() => {
    this.env = config.env;
    this.isDevelopment = config.isDevelopment;

    if (env !== 'development') {
      config.isDevelopment = false;
    }

    config.env = env;
  });

  afterEach(() => {
    config.env = this.env;
    config.isDevelopment = this.isDevelopment;
  });
}

export function mockCurrentDate(date) {
  const _Date = Date;

  beforeEach(() => {
    // @ts-ignore
    global.Date = jest.fn(() => date);
  });

  afterEach(() => {
    global.Date = _Date;
  });
}

export function salesforceId() {
  return chance.string({
    length: 15,
    casing: 'upper',
    alpha: true,
    numeric: true,
  });
}

const replacerFunc = () => {
  const visited = new WeakSet();
  return (_, value) => {
    if (typeof value === 'object' && value !== null) {
      if (visited.has(value)) {
        return;
      }
      visited.add(value);
    }
    return value;
  };
};

export function serialize(values: object[] | object) {
  return JSON.parse(JSON.stringify(values, replacerFunc()));
}
export function getKeywords(values: object[], path: string[]): string[] {
  return serialize(values).reduce(
    (agg: string[], val) => agg.concat(get(val, path).split(' ')),
    [],
  );
}
export function randomKeyword(values: object[], path: string[]): string {
  return chance.pickone(getKeywords(values, path));
}
export function compareDates(a: Date, b: Date): number {
  return b.valueOf() - a.valueOf();
}
