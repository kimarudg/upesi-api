import { SystemResourceModel } from './../../models/system-resource.model';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TYPES } from '@app/types';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { SystemRoleRepository } from '@core/modules/user/repositories/system-role.repository';
import { SystemResourcesRepository } from '@core/modules/user/repositories/system-resources.repository';

@Injectable()
export class SystemRoleService {
  public readonly repository: SystemRoleRepository;
  public readonly resourcesRepository: SystemResourcesRepository;

  async save(name: string): Promise<SystemRoleModel> {
    const newStatus = new SystemRoleModel();
    Object.assign(newStatus, { name });
    return this.repository.save(newStatus);
  }

  async update(status: Partial<SystemRoleModel>) {
    const newStatus = new SystemRoleModel();
    Object.assign(newStatus, status);
    return this.repository.save(newStatus);
  }

  async getRoles(skip, take) {
    return this.repository.getPaginatedRoles(skip, take);
  }

  async getRole(id: string) {
    return this.repository.findById(id);
  }

  async showRoles() {
    const connection = this.manager.connection.entityMetadatas.map((e) => {
      const {
        givenTableName,
        name,
        ownColumns,
        generatedColumns,
        propertiesMap,
      } = e;
      const attributes = e.generatedColumns.map((col) => col.propertyName);
      const columns = e.ownColumns.map((col) => col.propertyName);
      const cool = e.generatedColumns.map((col) => col.propertyName);
      return {
        columns,
        attributes,
        givenTableName,
        name,
        // generatedColumns,
        // propertiesMap,
      };
    });
    return connection;
  }

  async showResources(skip?: number, take?: number) {
    return this.resourcesRepository.findAndCount({ skip, take });
  }

  constructor(
    @Inject(TYPES.EntityManager) public readonly manager: EntityManager,
  ) {
    this.repository = manager.getCustomRepository(SystemRoleRepository);
    this.resourcesRepository = manager.getCustomRepository(
      SystemResourcesRepository,
    );
  }
}
