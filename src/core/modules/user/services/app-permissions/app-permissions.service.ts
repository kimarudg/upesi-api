import { Actions } from './../../../../constants/system-admin';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EntityManager, getConnection } from 'typeorm';
import { TYPES } from '@app/types';
import { PermissionModel } from '@core/modules/user/models/permissions.model';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { resources } from './system-resources';
import { SystemResourceModel } from '../../models/system-resource.model';
import { ADMINISTRATOR_ROLE } from '@app/core/constants';

@Injectable()
export class AppPermissionsService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    this.upsertAdminRole();
    const savedResources = [];
    const resources = await this.getResources();
    for (const resource of resources) {
      // check if there is another resource
      savedResources.push(await this.saveResource(resource));

      // this.assignPermissionToAdminRole(savedResource);
    }
    await this.assignPermissionToAdminRole(savedResources);
    this.initPermissions();
  }

  async getResources(): Promise<SystemResourceModel[]> {
    const resources = this.manager.connection.entityMetadatas.map((e) => {
      const { name, ownColumns } = e;
      const attributes = ownColumns.map((col) => col.propertyName);
      return new SystemResourceModel({
        attributes,
        name,
      });
    });
    return resources;
  }

  async saveResource(
    resource: SystemResourceModel,
  ): Promise<SystemResourceModel> {
    const existingResource = await this.manager.findOne(SystemResourceModel, {
      where: { name: resource.name },
    });

    if (existingResource) {
      //let difference = arrA.filter(x => !arrB.includes(x));
      // The difference will output the elements from array A that are not in the array B. The result will be [3,4].
      const addedAttributes = resource.attributes.filter(
        (f) => !existingResource.attributes.includes(f),
      );
      if (addedAttributes.length > 0) {
        existingResource.attributes.push(...addedAttributes);
      }

      const deletedAttributes = existingResource.attributes.filter(
        (r) => !resource.attributes.includes(r),
      );
      for (let x = 0; x < existingResource.attributes.length; x++) {
        const attribute = existingResource.attributes[x];
        if (!resource.attributes.includes(attribute)) {
          existingResource.attributes.splice(x, 1);
          x--;
        }
      }
      // @TODO: remove the permission as well

      return await this.manager.save(existingResource);
    }
    return await this.manager.save(SystemResourceModel, resource);
  }

  async upsertAdminRole() {
    const admin = await this.manager.findOne(
      SystemRoleModel,
      ADMINISTRATOR_ROLE.id,
    );
    if (!admin) {
      this.manager.save(SystemRoleModel, ADMINISTRATOR_ROLE);
    }
  }

  async assignPermissionToAdminRole(
    resources: SystemResourceModel[],
  ): Promise<SystemRoleModel> {
    const admin = await this.manager.findOne(
      SystemRoleModel,
      ADMINISTRATOR_ROLE.id,
    );

    resources.forEach(async (resource) => {
      let q = this.manager.connection
        .getRepository(PermissionModel)
        .createQueryBuilder('perm')
        .innerJoinAndSelect('perm.resource', 'resource')
        .innerJoinAndSelect('perm.role', 'role')
        .where('role.id = :roleId', { roleId: admin.id })
        .andWhere('resource.id = :resourceId', { resourceId: resource.id });

      const existingPermission = await q.getOne();

      if (!existingPermission) {
        const perms = [
          Actions.CreateAny,
          Actions.ReadAny,
          Actions.UpdateAny,
          Actions.DeleteAny,
        ].map((action) => {
          return new PermissionModel({
            action,
            resource,
            role: admin,
            attributes: '*',
          });
        });
        this.manager.save(PermissionModel, perms);
      }
    });

    return admin;
  }

  async initPermissions() {
    const savedPermissions = await this.manager.find(PermissionModel, {
      relations: ['resource', 'role'],
    });
    const permissions = savedPermissions.map((perm) => {
      const { action, attributes, role, resource } = perm;
      return {
        role: role.name,
        resource: resource.name,
        action,
        attributes,
      };
    });
  }

  constructor(
    @Inject(TYPES.EntityManager) public readonly manager: EntityManager,
  ) {}
}
