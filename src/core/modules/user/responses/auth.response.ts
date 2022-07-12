import { Field, ObjectType } from '@nestjs/graphql';
import { SystemRoleModel } from '@core/modules/user/models/system-roles.model';
import { Profile } from './../../user/models/profile.model';
import { UserModel } from './../../user/models/user.model';

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

  @Field((type) => [String], { nullable: true })
  permissions: string[];

  @Field((type) => Profile, { nullable: true })
  profile?: Profile;

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
