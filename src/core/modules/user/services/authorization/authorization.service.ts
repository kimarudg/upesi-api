import { UserModel } from '@core/modules/user/models/user.model';
import { Inject, Injectable } from '@nestjs/common';
import { Actions, IAccessPermission, IPermission } from '@app/core/constants';
import { AccessControl } from 'accesscontrol';
import { TYPES } from '@app/types';
import { EntityManager } from 'typeorm';
import { PermissionModel } from '@app/core/modules/user/models/permissions.model';

@Injectable()
export class AuthorizationService {
  public accessControl: AccessControl;
  constructor(
    @Inject(TYPES.EntityManager) public readonly manager: EntityManager, // accessControl?: AccessControl, // @Inject(TYPES.EntityManager) public readonly manager: EntityManager,
  ) {
    this.initAccessControl();
  }

  can(user: UserModel, permissions: IPermission[]) {
    //
    this.accessControl.can('Administrator').createAny('profile');
    if (!permissions.length) {
      return true;
    }
    const roles = user.systemRoles.map((r) => r.name);

    for (const permission of permissions) {
      for (const role of roles) {
        if (
          this.accessControl.can(role)[permission.action](permission.resource)
            .granted
        ) {
          return true;
        }
      }
    }
    return false;
  }
  canAnd(user: UserModel, permissions: IPermission[]) {
    const roles = user.systemRoles.map((r) => r.name);
    for (const permission of permissions) {
      for (const role of roles) {
        if (
          !this.accessControl.can(role)[permission.action](permission.resource)
            .granted
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private async initAccessControl() {
    const grants = await this.getAccessPermissions();
    this.accessControl = new AccessControl(grants);
  }

  async getAccessPermissions(): Promise<IAccessPermission[]> {
    const savedPermissions = await this.manager.find(PermissionModel, {
      relations: ['resource', 'role'],
    });
    return savedPermissions.map((perm) => {
      const { action, attributes, role, resource } = perm;
      return {
        role: role.name,
        resource: resource.name,
        action,
        attributes,
      };
    });
  }
}
