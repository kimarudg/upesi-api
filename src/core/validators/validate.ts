import { BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';

export const AsInput = { groups: ['input'] };
export const AsOutput = { groups: ['output'] };
export const AsEither = { always: true };

export async function validateInput(obj: any, throwOnErrors = false) {
  const errors = await validate(obj, AsInput);
  if (errors.length > 0 && throwOnErrors) {
    throw new ValidationException(errors);
  }
  return errors;
}

export async function validateOutput(obj: any, throwOnErrors = false) {
  const errors = await validate(obj, AsOutput);
  if (errors.length > 0 && throwOnErrors) {
    throw new ValidationException(errors);
  }
  return errors;
}

export class ValidationException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super({ errors });
  }
}
