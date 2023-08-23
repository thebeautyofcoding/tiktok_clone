import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class LikeType {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  postId: number;
}
