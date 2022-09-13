## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
```bash
$ npm install
```
#### Create `.env` file:
- [ ] Copy [env-sample.txt](./env-sample.txt) to .env and start to edit as appropriate

## Running the app
```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```
### Test (Not yet setup)
```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```
## DataBase: Postgres Setup
- [ ] Linux install: `apt-get install postgresql postgresql-contrib`
- [ ] Linux startup/stop: `pg_ctlcluster 12 main start`
- [ ] Linux get in as full user: `su - postgres` ; `psql`
- [ ] Mac homebrew install: `brew update; brew doctor; brew install postgresql@14`
- [ ] Mac homebrew start/stop: `brew services start|stop postgresql@14`
- [ ] Mac homebrew get in as admin: `psql postgres`
- [ ] Create database for API && add uuid extension:
```
postgres=# CREATE USER apitemplate WITH PASSWORD 'apitemplate';
CREATE ROLE
postgres=# CREATE DATABASE apitemplate OWNER apitemplate;
CREATE DATABASE
postgres=# \connect apitemplate;
You are now connected to database "apitemplate" as user "postgres".
apitemplate=# CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION
```
- [ ] Create Tables with [postgres/createTables.sh](./postgres/createTables.sh)
- [ ] Seed Data with [postgres/seedData.sh](./postgres/seedData.sh)
- [ ] Put the correct information into your .env file

## Auth Layer
### Switching between Auth Providers
The JWT library needs to know what to auth against and to switch between auth providers edit the [jwt.strategy.ts file](src/auth/jwt.strategy.ts) and [auth.config.ts](./src/auth/auth.config.ts) files. It would be nice to have both live and have the token parsed either way, however this is not something I've had time to look into. If someone else wants to write a patch for this it would be appreciated.
### Auth0 Setup
Following needs to be re-documented
- [ ] Create auth0 tenant 
- [ ] Clone / Install: `git@github.com:auth0-samples/auth0-python-web-app.git`
- [ ] Create application for the above: auth0/applications/applications -> Create ("PythonAuthKey" / regular web app). Register `http://localhost:3000/callback` as `Allowed Callback URLs` and `http://localhost:3000` as `Allowed Logout URLs` in your client settings.
- [ ] startup python: `python3 server.py` && browse to http://localhost:3000 (create account(s) as required) - grab `id_token` and store that for BearerToken as `TOKEN` in your `.env` file

#### Auth0 api setup (Not sure if needed?)
- [ ] Create API in auth0 auth0/applications/api -> Create ("NestAPI0905", id: "http://localhost:3001", sign: rs256)
- [ ] Machine2Machine Applications -> Grant application above to the list
- [ ] Put these settings into this `.env` file 

### FusionAuth Setup
- [ ] Requires Postgres and create new database (use username/password as appropriate for your use case)
```
psql  --> 
postgres=# CREATE USER fusionauth WITH PASSWORD 'fusionauth';
CREATE ROLE
postgres=# CREATE DATABASE fusionauth OWNER fusionauth;
CREATE DATABASE
```
- [ ] Get the binaries from here: https://fusionauth.io/download and install per the instruction for your system as appropriate
- [ ] Linux start/stop FA: `~/fusionauth/fusionauth/bin/startup||shutdown.sh`
- [ ] Mac homebrew start/stop: `brew services start|stop fusionauth-app`
- [ ] Admin will be at http://localhost:9011 
- [ ] Put in the details for the PG database above on the initial maintenance page, you have already created the database above so you do not need the superuser credentials
- [ ] Initialize setup with your own account && sign in
- [ ] Adjust host && server identifiers in `.env` if you are not running from localhost:9011
- [ ] Setup initial application: Applications -> Add. Give it a name and press save. 
- [ ] Open and from the initial oAuth page grab the client "id" client "secret" and put both into .env file
- [ ] Add redirect URLs: http://localhost:3000/oauth-redirect && http://localhost:3001/oauth-redirect (press return after each entry)
- [ ] Add request origin URLs: http://localhost:3000 && http://localhost:3001 (press return after each entry). Press `save` at the top 
- [ ] Edit/Switch to JWT section and select 'enabled'. Put your "issuer" in (for development fine to use acme.com) - enter into `.env` file. You can leave the other defaults in place. Press save
- [ ] MAKE sure that you see your "JWT Access Token signing key" as RS256 and not HS256, if you do not see the ability to generate you may have to go to settings->key manager and generate a RSA key that you utilize in the application settings.
- [ ] Edit/Switch to Security section and disable 'require api key' (DEV ONLY!) && enable 'Authentication Tokens' press save
- [ ] From the left navigation slect Settings->API Keys. Add "Description", select 'Key Manager' and press save. Grab that API key and enter into `.env`. NOTE: this is a full do anything key, this should NOT be used for production environments where keys will need to be properly scoped.
- [ ] Create initial user: Users->Add, assign email/phone/password, Save. On next page add registration and add your application && save
- [ ] Add INV_PASS and INV_EMAIL to match the user created in the prior step. Save your `.env` file
- [ ] Confirm if you can create a token with a POST to /login with something that looks like: `curl --data "{\"email\":\"mark+auth10@kortekaas.com\",\"password\":\"markTest1234\"}" --header "Content-Type: application/json" http://localhost:3001/login`. You should see a JWT token which should passverification on https://jwt.io as a RS256 token. Add to your .env file as TOKEN
- [ ] On the FA server, System->Login Records should show the login
- [ ] Try to run [runCurl](./runCurls.sh) with a simple get users. If this did not work double check your JWT configuration above. Debugging this is non-trivial but start with the comments in [jwt-auth.guards.ts](./src/auth/jwt-auth.guard.ts)
- [ ] Configure FAuth for sending email: you will need to add a SMTP relay under Tenants->Default->Edit->Email. For production you'll need a real relay with capacity, but for development a free sendgrid account will work, just create a smtp relay and put in values as: host: smtp.sendgrid.net, port: 465, username: apikey, (toggle change password) password: apikey from sendgrid, security: SSL, send from email: yours
- [ ] Create user/assign to application
- [ ] The initial data seed will likely not work beyond simple select-all, you'll have to setup a few real users with the correct matching UUIDs matching to properly test
