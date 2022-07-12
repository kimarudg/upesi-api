import { SystemResourceModel } from './../models/system-resource.model';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SystemResourceModel)
export class SystemResourcesRepository extends Repository<SystemResourceModel> {
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
