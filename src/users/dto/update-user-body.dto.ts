import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean,  IsString, IsDateString  } from "class-validator";

export class UpdateUserBodyDto {
  // NOTE: can use @ApiPropertyOptional if not required
  //  can also use enum as a variable for verification
  @ApiPropertyOptional ( { description: "Change active" } )
  @IsOptional()
  @IsBoolean()
  active: boolean;
  
  @ApiPropertyOptional ( { description: "Change email sent" } )
  @IsOptional()
  @IsBoolean()
  invite_email_sent: boolean;

  @ApiPropertyOptional ( { description: "Change email sent"  } )
  @IsOptional()
  @IsDateString()
  invite_last_sent_time: Date;
  
  @ApiPropertyOptional ( { description: 'Notifications String' } )
  @IsOptional()
  @IsString()
  notifications: string;
  
  @ApiPropertyOptional ( { description: "Change auth0 id" } )
  @IsOptional()
  @IsString()
  auth0_userid: string;
  
  @ApiPropertyOptional ( { description: "Change FusionAuth id" } )
  @IsOptional()
  @IsString()
  fusinonauth_userid: string;
  
  @ApiPropertyOptional ( { description: 'What Door()s to Grant' } )
  @IsOptional()
  door_uuids: string[];

  @ApiPropertyOptional ( { description: 'What Organizations()s to Grant' } )
  @IsOptional()
  org_uuids: string[];

  @ApiPropertyOptional ( { description: 'What Buildings()s to Grant' } )
  @IsOptional()
  building_uuids: string[];

}
