import { Test, TestingModule } from '@nestjs/testing';
import { StubService } from './stub.service';

describe('StubService', () => {
  let service: StubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StubService],
    }).compile();

    service = module.get<StubService>(StubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
