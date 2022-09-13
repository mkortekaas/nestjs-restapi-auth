// NOTE: wanted to have request.user.[RANDOM-ID] but this was how I solved the problem
import { Entity, Column } from "typeorm";
@Entity('jwtuser')
export class JwtUser {
    @Column() applicationId: string;
    @Column() aud: string;
    @Column() auth_time: string;
    @Column() authenticationType: string;
    @Column() email: string;
    @Column() email_verified: string;
    @Column() exp: string;
    @Column() iat: string;
    @Column() iss: string;
    @Column() jti: string;
    @Column() name: string;
    @Column() nickname: string;
    @Column() nonce: string;
    @Column() picture: string;
    @Column() preferred_username: string;
    @Column() scope: string;
    @Column() sid: string;
    @Column() sub: string;
    @Column() tid: string;
    @Column() updated_at: string;
}