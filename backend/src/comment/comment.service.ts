import {
  Controller,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Comment, Prisma } from '@prisma/client';
import { CommentCreateInput } from './comment.dto';

@Controller('comment')
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    return this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        user: true,
        post: true,
      },
    });
  }

  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    console.log(data);

    return this.prisma.comment.create({
      data,
      include: {
        user: true,
        post: true,
      },
    });
  }
  async deleteComment(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return new NotFoundException(
        `Comment with ID ${commentId} does not exist`,
      );
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException(
        "You don't have permission to delete this comment",
      );
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
