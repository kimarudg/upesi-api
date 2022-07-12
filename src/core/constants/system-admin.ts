const id = 'd722e0bc-5ec8-4c52-8ad5-4fbbb6a877e0';
export const SYSTEM_USER = {
  id,
};

export const ADMINISTRATOR_ROLE = {
  id,
  readonly: true,
  name: 'Administrator',
};

export enum Actions {
  CreateAny = 'create:any',
  CreateOwn = 'create:own',
  ReadAny = 'read:any',
  ReadOwn = 'read:own',
  UpdateAny = 'update:any',
  UpdateOwn = 'update:own',
  DeleteAny = 'delete:any',
  DeleteOwn = 'delete:own',
}

export enum Action {
  CreateAny = 'createAny',
  CreateOwn = 'createOwn',
  ReadAny = 'readAny',
  ReadOwn = 'readOwn',
  UpdateAny = 'updateAny',
  UpdateOwn = 'updateOwn',
  DeleteAny = 'deleteAny',
  DeleteOwn = 'deleteOwn',
}

export interface IAccessPermission {
  role: string;
  resource: string;
  action: string;
  attributes: string;
}

export interface IPermission {
  resource: string; // refer to AvailableResources Endpoint
  action: Action;
}

export const IS_PUBLIC_KEY = 'isPublic';
