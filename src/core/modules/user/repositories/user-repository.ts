import { UserSearchCriteria } from './../validators/user-search-criteria';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { UserModel } from '../models';

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {
  private saltRounds = 10;

  findByEmail(email: string, skipBlocked?: boolean) {
    const query = getRepository(UserModel)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.systemRoles', 'systemRoles')
      .leftJoinAndSelect('systemRoles.permissions', 'permissions')
      .where('user.email = :email', { email });
    if (skipBlocked) {
      query.andWhere(`user.blocked = :blocked`, { blocked: !skipBlocked });
    }
    return query.getOne();
  }

  findById(id: string) {
    return getRepository(UserModel)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.systemRoles', 'systemRoles')
      .leftJoinAndSelect('systemRoles.permissions', 'permissions')
      .where('user.id = :id', { id })
      .getOne();
  }

  getPaginatedUsers(skip, take, searchCriteria?) {
    const where: any = {
      deleted: false,
      archived: false,
    };
    return this.findAndCount({
      where,
      skip,
      take,
    });
  }

  async getPaginatedSearchResults(
    skip,
    take,
    searchCriteria?: UserSearchCriteria,
  ) {
    const query = getRepository(UserModel)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.systemRoles', 'systemRoles')
      .leftJoinAndSelect('systemRoles.permissions', 'permissions')
      .skip(skip)
      .take(take);
    return query.getManyAndCount();
  }
}
