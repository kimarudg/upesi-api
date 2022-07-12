import { SystemResourceModel } from '@core/modules/user/models/system-resource.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResourceResponse {
  constructor(resources: SystemResourceModel[], totalCount: number) {
    this.list = resources;
    this.totalCount = totalCount;
  }

  @Field((type) => Int)
  totalCount: number;

  @Field((type) => [SystemResourceModel])
  list: SystemResourceModel[];
}
