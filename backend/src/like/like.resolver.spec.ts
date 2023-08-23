import { Test, TestingModule } from '@nestjs/testing';
import { LikeResolver } from './like.resolver';

describe('LikeResolver', () => {
  let resolver: LikeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikeResolver],
    }).compile();

    resolver = module.get<LikeResolver>(LikeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
