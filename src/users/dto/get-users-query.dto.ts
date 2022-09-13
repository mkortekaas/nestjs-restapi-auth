import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsNotEmpty } from "class-validator";

export class GetUsersQueryDto {
  // NOTE: can use @ApiPropertyOptional if not required
  //  can also use enum as a variable for verification
  @ApiPropertyOptional( { description: 'starting point, default 0' } )
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  start: number = 0;

  @ApiPropertyOptional( { description: 'count, default 20' } )
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  count: number = 20;
  
}
