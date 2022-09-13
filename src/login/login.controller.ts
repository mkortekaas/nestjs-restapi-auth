import { SetMetadata, Controller, Post, Req, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';

// need to have this anywhere we need to have a controller w/o JWT guard in place
export const AllowAny = () => SetMetadata('allow-any', true);

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @AllowAny()
  login( @Req() request: Request, @Body() loginUserDto: LoginUserDto ) {
    console.debug("====== In login.get()====================================");
    //console.debug(request.query);

    if (loginUserDto.auth_type === 'FusionAuth') {
      return this.loginService.loginFusionAuth(request, loginUserDto);
    }
    const myStr = "Auth type: " + loginUserDto.auth_type + " Is not implemented in controller";
    return (myStr)
  }
}
