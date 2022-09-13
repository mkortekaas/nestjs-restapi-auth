import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStubBodyDto } from './dto/create-stub-body.dto';
import { GetStubQueryDto } from './dto/get-stub-query.dto';
import { UpdateStubBodyDto } from './dto/update-stub-body.dto';
import { Stub } from './entities/stub.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StubService {
  constructor(
    @InjectRepository(Stub) private readonly stubRepository: Repository<Stub>,
  ) {}
  
  async create(createStubBodyDto: CreateStubBodyDto) {
    console.debug("---------- stub.service.create() --------------------");
    // TODO - get user_uuid from the caller/security token
        // TODO: Add security check here to make sure the calling user can do this     
    return("Do Something in here")
  }

  findAll(getStubQueryDto: GetStubQueryDto) {
    console.debug("---------- stub.service.findAll() --------------------");
    return this.stubRepository.find();
  }

  findOne(stub_uuid: string) {
    console.debug("---------- stub.service.findOne(", stub_uuid, ") --------------------");
    return this.stubRepository.findOne( { where: {"stub_uuid": stub_uuid}} );
  }

  async update(stub_uuid: string, updateStubBodyDto: UpdateStubBodyDto) {
    console.debug("---------- stub.service.update(", stub_uuid, ")--------------------");
    // TODO: Add security check here to make sure the calling user can do this     

    // Confirm the given UUID actually exists
    const verifyUUID = await this.stubRepository.findOne( { where: {'stub_uuid': stub_uuid}});
    if (verifyUUID === null) {
      throw new HttpException('UUID Does not Exist', HttpStatus.BAD_REQUEST);
    }

    console.debug("BEFORE: ", verifyUUID);
    const result = await this.stubRepository.update(stub_uuid, updateStubBodyDto);
    console.debug(result);
    const afterUUID = await this.stubRepository.findOne( { where: {'stub_uuid': stub_uuid}});
    console.debug("After: ", afterUUID)
    return(afterUUID);
  }

  async remove(stub_uuid: string) {
    console.debug("---------- stub.service.remove(", stub_uuid, ")--------------------");
    // TODO: Add security check here to make sure the calling user can do this     

    // TODO: What logic do we actually want on this one - for now setting active -> FALSE
    // Confirm the given UUID actually exists
    const verifyUUID = await this.stubRepository.findOne({ where: { 'stub_uuid': stub_uuid } });
    if (verifyUUID === null) {
      throw new HttpException('UUID Does not Exist', HttpStatus.BAD_REQUEST);
    }
    console.debug("BEFORE: ", verifyUUID);
    const result = await this.stubRepository.update(stub_uuid, {'active': false});
    console.debug(result);
    const afterUUID = await this.stubRepository.findOne({ where: { 'stub_uuid': stub_uuid } });
    console.debug("After: ", afterUUID)
    return (afterUUID);
  }
}
