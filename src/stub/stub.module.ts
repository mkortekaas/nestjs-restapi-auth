import { Module } from '@nestjs/common';
import { StubService } from './stub.service';
import { StubController } from './stub.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stub } from './entities/stub.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stub]),],
  controllers: [StubController],
  providers: [StubService]
})
export class StubModule {}
