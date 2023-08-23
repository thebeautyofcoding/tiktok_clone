import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comment/comment.type';
import { LikeType } from 'src/like/like.model';
import { User } from 'src/user/user.model';

@ObjectType()
export class PostType {
  @Field(() => Int)
  id: number;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  video: string;
  @Field(() => User)
  user?: User;

  @Field(() => [LikeType], { nullable: true })
  likes?: LikeType[];
}

@ObjectType()
export class PostDetails extends PostType {
  @Field(() => [Number], { nullable: true })
  otherPostIds?: number[];
}
