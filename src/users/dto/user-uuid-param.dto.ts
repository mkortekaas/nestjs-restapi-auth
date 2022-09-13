import { IsUUID } from "class-validator";

export class UserUUUIDParam {
    @IsUUID(4)
    user_uuid: string;
}