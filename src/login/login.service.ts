import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { FusionAuthClient } from '@fusionauth/typescript-client';

@Injectable()
export class LoginService {
  async loginFusionAuth(request: Request, loginUserDto: LoginUserDto) {
    var myStr = "TODO: Perform Login. User: " + loginUserDto.email + " Passwd: " + loginUserDto.password ;
    console.debug(myStr)
    console.debug(request.query)

    const client = new FusionAuthClient(process.env.FUSIONA_APIKEY, process.env.FUSIONA_SERVER, process.env.FUSIONA_TENANT);
    const clientResponse = await client
      .login ({
        "loginId": loginUserDto.email,
        "password": loginUserDto.password,
        "applicationId": process.env.FUSIONA_CLIENTID,
        "noJWT": false
      })
      .catch(err => { return err; });

    console.debug(clientResponse, "-----------------------------------------")

    if (clientResponse.statusCode === 200 ) {
      const retVal = "TOKEN=" + clientResponse.response.token + "\n"
      return(retVal)
    }
    myStr = "Erorr Number: " + clientResponse.statusCode.toString() + " See: https://fusionauth.io/docs/v1/tech/apis/login for error numbers"
    return(myStr)
  }
}
