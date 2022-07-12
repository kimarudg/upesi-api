import { SECRETS } from './logger.constants';

function maskPossibleSecrets(message: string, meta: any) {
  // tslint:disable-next-line:forin
  for (const possibleSecrets in SECRETS) {
    if (
      SECRETS.hasOwnProperty(possibleSecrets) &&
      SECRETS[possibleSecrets].length > 0
    ) {
      let match;
      const matchString = SECRETS[possibleSecrets].join('|');
      const regex = new RegExp(matchString);
      match = message.match(regex);

      while (match && match.length > 0) {
        const toBeMasked = match[0];
        message = message.replace(toBeMasked, '********');
        match = message.match(regex);

        if (!match) break;
      }

      meta = Object.keys(meta).reduce((maskedMeta, key) => {
        if (SECRETS[possibleSecrets].includes(key)) {
          maskedMeta[key] = '<REDACTED>';
        } else {
          maskedMeta[key] = meta[key];
        }
        return maskedMeta;
      }, {});
    }
  }

  return {
    msg: message,
    meta,
  };
}

export { maskPossibleSecrets };
