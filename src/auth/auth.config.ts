import { registerAs } from '@nestjs/config';

// AUTH0 OR FUSIONAUTH: To switch comment/uncomment the appropriate lines below && in jwt.strategy.ts

export default registerAs('auth', () => ({
  
  // domain: process.env.AUTH0_DOMAIN,
  // clientId: process.env.AUTH0_CLIENT_ID,
  // clientSecret: process.env.AUTH0_CLIENT_SECRET,
  // audience: process.env.AUTH0_AUDIENCE,

  domain: process.env.FUSIONA_HOST,
  clientId: process.env.FUSIONA_CLIENTID,
  clientSecret: process.env.FUSIONA_CLIENTSECRET,
  audience: process.env.FUSIONA_CLIENTID,

}));