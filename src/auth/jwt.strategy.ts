import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BaseStrategy, ExtractJwt } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import {JwtPayload } from './interfaces/jwt-payload.interface';

// pull config from environment/.env if issue
// import * as dotenv from 'dotenv';
// dotenv.config();

// 
// NOTE: This does NOT work with anything other than RS256
//

// AUTH0 OR FUSIONAUTH: To switch comment/uncomment the appropriate lines below && in auth-config

@Injectable()
export class JwtStrategy extends PassportStrategy(BaseStrategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        // jwksUri: `${process.env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
        jwksUri: `${process.env.FUSIONA_SERVER}.well-known/jwks.json`,
      }),
      
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // audience: process.env.AUTH0_AUDIENCE,
      // issuer: `${process.env.AUTH0_ISSUER_URL}`,
      audience: process.env.FUSIONA_CLIENTID,
      issuer: `${process.env.FUSIONA_ISSUER}`,

      // TODO (??): This ONLY works with RS256, the HS256 never comes into play
      algorithms: ['RS256', ],
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // console.debug("++++++++++++ jwt-validate ++++ ", payload, "------------- jwt ---------------");
    return payload;
  }
}
