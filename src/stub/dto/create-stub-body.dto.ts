import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from "class-validator";

export class CreateStubBodyDto {
    // active BOOLEAN DEFAULT FALSE,
    @ApiPropertyOptional ( { description: 'active to true/false'})
    @IsOptional()
    @IsBoolean()
    active: boolean;
}
