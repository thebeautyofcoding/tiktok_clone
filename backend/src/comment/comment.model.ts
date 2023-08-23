import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostType } from 'src/post/post.type';
import { User } from 'src/user/user.model';

@ObjectType()
export class Comment {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  userId: number;

  @Field((type) => Int)
  postId: number;

  @Field((type) => User)
  user: User;

  // Assuming Post model exists
  @Field((type) => PostType)
  post: PostType;

  @Field()
  text: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
