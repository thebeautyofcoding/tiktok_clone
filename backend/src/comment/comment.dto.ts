import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CommentCreateInput {
  @Field()
  text: string;
}
