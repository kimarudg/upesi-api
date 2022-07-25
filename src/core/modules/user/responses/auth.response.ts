import { Field, ObjectType } from '@nestjs/graphql';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { Profile } from './../../user/models/profile.model';
import { UserModel } from './../../user/models/user.model';
import { AuthPermissionResponse } from './auth-permission.response';

@ObjectType()
export class AuthResponse {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  needPasswordChange: boolean;

  @Field({ nullable: true })
  lastLogin?: Date;

  @Field({ nullable: true })
  loginCount?: number;

  @Field()
  failedLogins?: number;

  @Field((type) => [SystemRoleModel], { nullable: true })
  systemRoles?: SystemRoleModel[];

  @Field({ nullable: true })
  confirmed?: boolean;

  @Field({ nullable: true })
  lastSeen?: Date;

  @Field({ nullable: true })
  avatarHash?: string;

  @Field({ nullable: false })
  phone: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field((type) => [AuthPermissionResponse], { nullable: true })
  permissions: AuthPermissionResponse[];

  @Field((type) => Profile, { nullable: true })
  profile?: Profile;

  constructor(user: Partial<UserModel>) {
    const permissions = [];
    for (const role of user.systemRoles) {
      const resource = role.permissions.map((p) => {
        return {
          resource: p.resource.name,
          action: p.action,
        };
      });
      permissions.push(...resource);
    }
    Object.assign(this, user);
    this.permissions = permissions;
  }
}
