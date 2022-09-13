import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class LoginUserDto {
  // NOTE: can use @ApiPropertyOptional if not required
  //  can also use enum as a variable for verification
  @ApiProperty ( { description: 'Email' } )
  @IsEmail() 
  @IsNotEmpty()
  email: string;

  @ApiProperty( { description: 'Password' } )
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional( { description: 'Which AUTH System: FusionAuth or Auth0 - defaults to FusionAuth)' } )
  @IsOptional()
  @IsNotEmpty()
  auth_type: string = 'FusionAuth'

}