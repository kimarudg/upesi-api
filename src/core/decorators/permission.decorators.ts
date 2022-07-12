import { IPermission } from '@app/core/constants';
import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: IPermission[]) =>
  SetMetadata('permissions', permissions);
