import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export function getTokenFromHeader(request: any): string | undefined {
  const authorizationHeader = request?.headers?.authorization;
  if (!authorizationHeader) {
    return undefined;
  }
  const parts = authorizationHeader.split(' ');

  if (parts.length < 2) {
    return;
  }

  return parts[1];
}

export const GoogleToken = createParamDecorator((_, context: any): string => {
  const arg = Array.isArray(context) ? context[2].req : context;
  const result = getTokenFromHeader(arg);
  if (result === undefined) {
    throw new UnauthorizedException('Invalid or missing authorization header');
  }
  return result;
});
