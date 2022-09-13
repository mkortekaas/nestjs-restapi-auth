import { IsUUID } from "class-validator";

export class StubUUUIDParam {
    @IsUUID(4)
    stub_uuid: string;
}