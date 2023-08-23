import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Post, Prisma } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { createWriteStream } from 'fs';
import { PostDetails, PostType } from './post.type';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async saveVideo(video: {
    createReadStream: () => any;
    filename: string;
    mimetype: string;
  }): Promise<string> {
    if (!video || !['video/mp4'].includes(video.mimetype)) {
      throw new BadRequestException(
        'Invalid video file format. Only MP4 is allowed.',
      );
    }

    const videoName = `${Date.now()}${extname(video.filename)}`;
    const videoPath = `/files/${videoName}`;

    const stream = video.createReadStream();
    const outputPath = `public${videoPath}`;
    const writeStream = createWriteStream(outputPath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    return videoPath;
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return await this.prisma.post.create({
      data: data,
    });
  }

  async getPostById(id: number): Promise<PostDetails> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: { user: true, likes: true, comments: true },
      });
      // get all other post ids of the user with the post above
      const postIds = await this.prisma.post.findMany({
        where: { userId: post.userId },
        select: { id: true },
      });

      return { ...post, otherPostIds: postIds.map((post) => post.id) };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  // get posts
  async getPosts(skip: number, take: number): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      skip,
      take,
      include: { user: true, likes: true, comments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // get all the posts of a user
  async getPostsByUserId(userId: number): Promise<PostType[]> {
    return await this.prisma.post.findMany({
      where: { userId },
      include: { user: true },
    });
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.getPostById(id);

    if (post.video) {
      // Delete the video file from /files/ directory
      try {
        const fs = await import('fs');
        fs.unlinkSync(`public${post.video}`);
      } catch (err) {
        console.error(`Failed to delete video file: ${post.video}`, err);
      }
    }

    await this.prisma.post.delete({ where: { id } });
  }
}

export const storage = diskStorage({
  destination: './public/files',
  filename: (req, file, cb) => {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
  },
});
