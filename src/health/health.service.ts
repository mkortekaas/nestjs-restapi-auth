import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';

@Injectable()
export class HealthService {
  findAll() {
    return "TODO: Perform Health Check";
  }
}
