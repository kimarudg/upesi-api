import { EntityRepository, Repository } from 'typeorm';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';

@EntityRepository(SystemRoleModel)
export class SystemRoleRepository extends Repository<SystemRoleModel> {
  findById(id: string) {
    return this.findOne({ where: { id }, relations: ['permissions', 'users'] });
  }

  getPaginatedRoles(skip, take) {
    return this.findAndCount({
      relations: ['permissions'],
      skip,
      take,
    });
  }
}
