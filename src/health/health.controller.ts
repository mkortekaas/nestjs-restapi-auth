import { SetMetadata, Controller, Get, Req } from '@nestjs/common';
import { HealthService } from './health.service';
import { Request } from 'express';

// need to have this anywhere we need to have a controller w/o JWT guard in place
export const AllowAny = () => SetMetadata('allow-any', true);

@Controller('healthcheck')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @AllowAny()
  findAll( @Req() request: Request) {
    console.debug("====== In healhcheck.get()====================================");
    //console.debug(request.query);
    return this.healthService.findAll();
  }
}
