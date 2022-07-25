import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthPermissionResponse {
  @Field((type) => String, { nullable: true })
  resource: string;

  @Field((type) => String, { nullable: true })
  action: string;
}
