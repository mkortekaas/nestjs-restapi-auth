import { Reflector } from '@nestjs/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Debugging note: Not sure if there is a way to better trace JWT errors
// but if the below section does not help enough:
//   vi node_modules/@nestjs/passport/dist/auth.guard.js
// and change handleRequest() to include the console.log() below:
//      handleRequest(err, user, info, context, status) {
//        console.log({ err, user, info, context, status })
//            if (err || !user) {
//                throw err || new common_1.UnauthorizedException();
//            }
//            return user;
//        }
//        getAuthenticateOptions(context) {
//            return undefined;
//        }

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super({
      // TODO (??): This ONLY works with RS256, the HS256 never comes into play (see also jwt.strategy.ts)
      algorithms: ['RS256'],
    });
  }

  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    const allowAny = this.reflector.get<string[]>('allow-any', context.getHandler());
    if (user) return user;
    if (allowAny) return true;
    // COMMENT/UNCOMMENT for debugging as required
    // console.debug(" JWT ERROR DETAIL ============================================================")
    // console.debug("ERROR: ", err, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    // console.debug("USER: ", user, "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    // console.debug("INFO: ", info, "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");
    // console.debug("CONTEXT: ", context, "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
    throw new UnauthorizedException();
  }
}
