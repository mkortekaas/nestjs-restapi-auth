import { PartialType } from '@nestjs/mapped-types';
import { CreateStubBodyDto } from './create-stub-body.dto';

export class UpdateStubBodyDto extends PartialType(CreateStubBodyDto) {}