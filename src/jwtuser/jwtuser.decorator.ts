// NOTE: wanted to have request.user.[RANDOM-ID] but this was how I solved the problem
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const JwtCurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      return null;
    }
    return data ? user?.[data] : user; // extract a specific property only if specified or get a user object
  },
);