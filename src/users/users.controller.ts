import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtCurrentUser } from '../jwtuser/jwtuser.decorator';
import { JwtUser } from '../jwtuser/entity/jwtuser.entity';
import { UsersService } from './users.service';
import { CreateUserBodyDto } from './dto/create-user-body.dto';
import { CreateUserQueryDto } from './dto/create-user-query.dto';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { UpdateUserBodyDto } from './dto/update-user-body.dto';
import { UserUUUIDParam } from './dto/user-uuid-param.dto';

@Controller('apiV1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // this has to be ahead of other GET routes or will fail the USER-UUID check
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Req() request: Request, @JwtCurrentUser() jwtuser: JwtUser ) {
    console.debug("====== In users.profile()====================================");
    if (jwtuser.iss.toLowerCase() === process.env.AUTH0_ISSUER_URL.toLowerCase() ) {
      return this.usersService.profileAuth0(request, jwtuser);
    }
    return this.usersService.profileFusionAuth(request, jwtuser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() request: Request, @JwtCurrentUser() jwtuser: JwtUser, @Body() createUserBodyDto: CreateUserBodyDto, @Query() createUserQueryDto: CreateUserQueryDto) {
    console.debug("====== In users.post()====================================");
    if (jwtuser.iss.toLowerCase() === process.env.AUTH0_ISSUER_URL.toLowerCase() ) {
      return this.usersService.createAuth0(request, jwtuser, createUserBodyDto, createUserQueryDto);
    }
    return this.usersService.createFusionAuth(request, jwtuser, createUserBodyDto, createUserQueryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll( @Req() request: Request, @Query() getUsersQueryDto: GetUsersQueryDto) {
    console.debug("====== In users.get()====================================");
    return this.usersService.findAll(request, getUsersQueryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':user_uuid')
  findOne(@Req() request: Request, @Param() params: UserUUUIDParam ) {
    console.debug("====== In users.get(", params.user_uuid, ")====================================");
    return this.usersService.findOne(request, params.user_uuid);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  updateMe(@Req() request: Request, @JwtCurrentUser() jwtuser: JwtUser, @Body() updateUserBodyDto: UpdateUserBodyDto) {
    console.debug("====== In users.put.profile()====================================");
    if (jwtuser.iss.toLowerCase() === process.env.AUTH0_ISSUER_URL.toLowerCase() ) {
      return this.usersService.updateMeAuth0(request, jwtuser, updateUserBodyDto);
    }
    return this.usersService.updateMeFusionAuth(request, jwtuser, updateUserBodyDto);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Put(':user_uuid')
  updateUser(@Req() request: Request, @Param() params: UserUUUIDParam, @Body() updateUserBodyDto: UpdateUserBodyDto) {
    console.debug("====== In users.put(", params.user_uuid, ")====================================");
    return this.usersService.updateUser(request, params.user_uuid, updateUserBodyDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':user_uuid')
  remove(@Req() request: Request, @Param() params: UserUUUIDParam) {
    console.debug("====== In users.delete(", params.user_uuid, ")====================================");
    return this.usersService.remove(request, params.user_uuid);
  }
}
