import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserBodyDto {
  // NOTE: can use @ApiPropertyOptional if not required
  //  can also use enum as a variable for verification
  @ApiPropertyOptional( { description: 'Phone Number to invite' } )
  @IsOptional()
  @MinLength(3)
  @IsNotEmpty()
  invite_phone: string;

  @ApiPropertyOptional( { description: 'Email Address to invite' } )
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  invite_email: string;

  @ApiPropertyOptional( { description: 'Initial Password (TESTING Only)' } )
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  initial_password: string;

  @ApiPropertyOptional ( { description: 'What Door()s to Grant' } )
  @IsOptional()
  door_uuids: string[];

  @ApiPropertyOptional ( { description: 'What Organizations()s to Grant' } )
  @IsOptional()
  org_uuids: string[];

  @ApiPropertyOptional ( { description: 'What Buildings()s to Grant' } )
  @IsOptional()
  building_uuids: string[];

  @ApiPropertyOptional ( { description: 'Notifications String' } )
  @IsOptional()
  notifications: string;
}
