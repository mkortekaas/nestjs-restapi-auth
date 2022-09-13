import { Injectable, HttpException, HttpStatus, createParamDecorator } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { CreateUserQueryDto } from './dto/create-user-query.dto';
import { UpdateUserBodyDto } from './dto/update-user-body.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { Users } from './entities/users.entity';
import { JwtUser } from '../jwtuser/entity/jwtuser.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ManagementClient, User } from 'auth0';
import { FusionAuthClient } from '@fusionauth/typescript-client';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {}

  async createAuth0(request: Request, jwtuser: JwtUser, createUserBodyDto: CreateUserBodyDto, createUserQueryDto: CreateUserQueryDto) {
    console.debug("---------- users.service.createAuth0() --------------------");
    const authInfo = await this.profileAuth0(request, jwtuser);

    var my_user_uuid = uuidv4();
    console.debug("AAAAAAAAAAAAAAAAAaa", my_user_uuid, "BBBBBBBBBBBBBBB");
      
    if ( typeof(authInfo?.app_metadata?.user_uuid) === undefined ) {
      // TODO: for testing we might not have this, just dummy up for now
      console.debug("foo")
      my_user_uuid = authInfo.app_metadata.user_uuid;
    }
    console.debug("AAAAAAAAAAAAAAAAAaa", my_user_uuid, "BBBBBBBBBBBBBBB");

    // THIS does not do what we need here after all with auth0
    //     The below does create a user, but it's user/password and the user then has to reset password
    //     What we really need to do is (probably?)
    //       1. Create invite in our system/email user as a proper user 
    //       2. Have them go to the app which then forks auth0
    //       3. From there we get the auth0 id back - which will differ based on auth type on that side
    //       4. seed a generated uuid back/forth between the two systems
    
    const authZero = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_API_CLIENT_ID,
      clientSecret: process.env.AUTH0_API_CLIENT_SECRET,
       // NOTE: must create with all scopes we will use across this application
       scope: 'read:users create:users'
    });

    const response = await authZero
      .createUser( {
        "connection": "Username-Password-Authentication",
        "email": createUserBodyDto.invite_email,
        "password": createUserBodyDto.initial_password
      })
      .then((user: User) => {
        return user;
      })
      .catch(err => {
        return err;
      });
    console.debug(response, "-----------------------");
    
    // this creates the user on our side
    let newUser = new Users();
    newUser.user_uuid = uuidv4(); 
    newUser.invite_email = createUserBodyDto.invite_email;
    newUser.invite_phone = createUserBodyDto.invite_phone;
    newUser.auth0_userid = response.user_id;
    newUser.created_by_uuid = my_user_uuid;
    console.debug(newUser);
    const savedUser = await this.usersRepository.save(newUser);
    console.debug(savedUser);
    
    return (response);
  }
  
  async createFusionAuth(request: Request, jwtuser: JwtUser, createUserBodyDto: CreateUserBodyDto, createUserQueryDto: CreateUserQueryDto) {
    console.debug("---------- users.service.create() --------------------");
    
    // get current user info from auth system
    const authInfo = await this.profileFusionAuth(request, jwtuser);

    // TODO: Add security check here to make sure the calling user can do this 

    const new_user_uuid = uuidv4();
    const user_uuid = authInfo.id;

    const client = new FusionAuthClient(process.env.FUSIONA_APIKEY, process.env.FUSIONA_SERVER);
    const clientResponse = await client
      .register( new_user_uuid, {
        "registration": {
          "applicationId": process.env.FUSIONA_CLIENTID,
        },
        "sendSetPasswordEmail": true,
        "user": {
            "email": createUserBodyDto.invite_email,
            "mobilePhone": createUserBodyDto.invite_phone,
        }
      })
      .catch(err => { return err; });

    console.debug(clientResponse, "-----------------------------------------")

    // TODO: confirm that status=200 && clientResponse.response.user.id is same as new_user_uuid
    console.debug(clientResponse.statusCode, "---------------------------------")

    // this creates the user on our side
    let newUser = new Users();
    newUser.user_uuid = new_user_uuid; 
    newUser.invite_email = createUserBodyDto.invite_email;
    newUser.invite_phone = createUserBodyDto.invite_phone;
    newUser.fusionauth_uuid = new_user_uuid;
    newUser.created_by_uuid = user_uuid;
    console.debug(newUser);
    const response = await this.usersRepository.save(newUser);
    console.debug(response);
    
    return (response);
  }

  findAll(request: Request, getUsersQueryDto: GetUsersQueryDto) {
    console.debug("---------- users.service.findAll() --------------------");
    const { start, count } = getUsersQueryDto;
    console.debug(start, " typeof: ", typeof(start));
    console.debug(count, " typeof: ", typeof(count));

    // TODO: bound the query with start/count
    return this.usersRepository.find();
  }

  findOne(request: Request, user_uuid: string) {
    console.debug("---------- users.service.findOne(", user_uuid, ") --------------------");
    return this.usersRepository.findOne( { where: {"user_uuid": user_uuid}} );
  }

  async updateMeAuth0(request: Request, jwtuser: JwtUser, updateUserBodyDto: UpdateUserBodyDto) {
    console.debug("---------- users.service.updateMe() --------------------");
    const authInfo = await this.profileAuth0(request, jwtuser);
    console.debug(authInfo);

    // AUTH0: authInfo.app_metadata.user_uuid is our UUID
    return this.updateUser(request, authInfo.app_metadata.user_uuid, updateUserBodyDto);
  }

  async updateMeFusionAuth(request: Request, jwtuser: JwtUser, updateUserBodyDto: UpdateUserBodyDto) {
    console.debug("---------- users.service.updateMe() --------------------");
    const authInfo = await this.profileFusionAuth(request, jwtuser);
    console.debug(authInfo);

    // FUSIONAUTH: authInfo.id is our UUID (once we set it to be)
    return this.updateUser(request, authInfo.id, updateUserBodyDto);
  }

  async updateUser(request: Request, user_uuid: string, updateUserBodyDto: UpdateUserBodyDto) {
    console.debug("---------- users.service.update(", user_uuid, ")--------------------");
    console.debug(user_uuid);
    console.debug(updateUserBodyDto);

    // TODO: Add security check here to make sure the calling user can do this 

    // Confirm the given UUID actually exists
    const verifyUUID = await this.usersRepository.findOne( { where: {'user_uuid': user_uuid}});
    if (verifyUUID === null) {
      throw new HttpException('UUID Does not Exist', HttpStatus.BAD_REQUEST);
    }

    console.debug("BEFORE: ", verifyUUID);
    const result = await this.usersRepository.update(user_uuid, updateUserBodyDto);
    console.debug(result);
    const afterUUID = await this.usersRepository.findOne( { where: {'user_uuid': user_uuid}});
    console.debug("After: ", afterUUID)
    return(afterUUID);
  }

  async remove(request: Request, user_uuid: string) {
    console.debug("---------- users.service.remove(", user_uuid, ")--------------------");
 
    // TODO: Add security check here to make sure the calling user can do this 

    // TODO: What logic do we actually want on this one - for now setting active -> FALSE
    // Confirm the given UUID actually exists
    const verifyUUID = await this.usersRepository.findOne({ where: { 'user_uuid': user_uuid } });
    if (verifyUUID === null) {
      throw new HttpException('UUID Does not Exist', HttpStatus.BAD_REQUEST);
    }
    console.debug("BEFORE: ", verifyUUID);
    const result = await this.usersRepository.update(user_uuid, {'active': false});
    console.debug(result);
    const afterUUID = await this.usersRepository.findOne({ where: { 'user_uuid': user_uuid } });
    console.debug("After: ", afterUUID)
    return (afterUUID);
  }

  async profileAuth0(request: Request, jwtuser: JwtUser) {
    console.debug("---------- users.service.profileAuth0() --------------------");
  
    // AUTH0 - the jwtPayload.sub value is their auth+userid, from there
    //   have to map to a uniquue UUID we can reference. Auth0 does allow
    //   for app defined metadata which this will return in 
    //   response.app_metadata.user_uuid (assuming we've set that value)
    const authZero = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_API_CLIENT_ID,
      clientSecret: process.env.AUTH0_API_CLIENT_SECRET,
      // NOTE: must create with all scopes we will use across this application
      scope: 'read:users create:users'
    });

    // user id has to be the full user_id from auth0 (with provider at the front)
    console.debug(jwtuser.sub);
    const response = await authZero
      .getUser({ id: jwtuser.sub }) 
      .then((user: User) => {
        return user;
      })
      .catch(err => {
        return err;
      });
    console.debug(response, "-----------------------------------------");
    return (response);
  }

  async profileFusionAuth(request: Request, jwtuser: JwtUser) {
    console.debug("---------- users.service.profileFusionAuth() --------------------");
      // FUSIONAUTH - we can use the jwtPayload.sub value as a unique UUID to match against
    const client = new FusionAuthClient(process.env.FUSIONA_APIKEY, process.env.FUSIONA_SERVER);
    console.debug(jwtuser.sub);
    const clientResponse = await client
      .retrieveUser(jwtuser.sub)
      .catch(err => {
        return err;
      });

    console.debug(clientResponse.response.user, "------------------------------------");
    return(clientResponse.response.user);
  }
}
