import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { StubService } from './stub.service';
import { CreateStubBodyDto } from './dto/create-stub-body.dto';
import { GetStubQueryDto } from './dto/get-stub-query.dto';
import { UpdateStubBodyDto } from './dto/update-stub-body.dto';
import { StubUUUIDParam } from './dto/stub-uuid-param.dto';

@Controller('stub')
export class StubController {
  constructor(private readonly stubService: StubService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Put(':stub_uuid')
  update(@Param() param: StubUUUIDParam, @Body() updateStubBodyDto: UpdateStubBodyDto) {
    console.debug("====== In stub.put(", param.stub_uuid, ")====================================")
    return this.stubService.update(param.stub_uuid, updateStubBodyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create( @Req() request: Request, @Body() createStubBodyDto: CreateStubBodyDto) {
    console.debug("====== In stub.post()====================================");
    return this.stubService.create(createStubBodyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll( @Req() request: Request, @Query() getStubQueryDto: GetStubQueryDto) {
    console.debug("====== In stub.get()====================================");
    console.debug(request.query);
    return this.stubService.findAll(getStubQueryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':stub_uuid')
  findOne( @Param() param: StubUUUIDParam) {
    console.debug("====== In stub.get(", param.stub_uuid, ")====================================");
    return this.stubService.findOne(param.stub_uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':stub_uuid')
  remove(@Param() param: StubUUUIDParam ) {
    console.debug("====== In stub.delete(", param.stub_uuid, ")====================================");
    return this.stubService.remove(param.stub_uuid);
  }
}
