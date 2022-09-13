import { Test, TestingModule } from '@nestjs/testing';
import { StubController } from './stub.controller';
import { StubService } from './stub.service';

describe('StubController', () => {
  let controller: StubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
      providers: [StubService],
    }).compile();

    controller = module.get<StubController>(StubController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
