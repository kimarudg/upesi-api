import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '@core/constants';

export const IsPublic = () => {
  return SetMetadata(IS_PUBLIC_KEY, true);
};
