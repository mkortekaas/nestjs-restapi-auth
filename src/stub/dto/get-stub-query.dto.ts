import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsNotEmpty } from "class-validator";

export class GetStubQueryDto {
    @ApiPropertyOptional( { description: 'starting point, default 0' } )
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    start: number = 0;
  
    @ApiPropertyOptional( { description: 'count, default 20' } )
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    count: number = 20;
}
