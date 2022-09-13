import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  // For now building on our side and not in DB
  //   user_uuid uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  //   @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')   user_uuid: string;
  @Column({ type: 'uuid', name: 'created_by_uuid', nullable: false,  })  created_by_uuid: string;

  // active BOOLEAN DEFAULT FALSE,
  @Column({ type: 'boolean', default: false, })  active: boolean;
  @Column({ type: 'text', default: '', })  invite_email: string;
  @Column({ type: 'text', default: '', })  invite_phone: string;
  @Column({ type: 'boolean', default: false, })  invite_email_sent: boolean;
  @Column({ type: 'timestamptz', nullable: true, })  invite_last_sent_time: Date;
  @Column({ type: 'text', default: '', nullable: true, })  notifications: string;
  
  // auth relationship
  @Column({ type: 'text', default: '', nullable: true, })  auth0_userid: string;
  @Column({ type: 'uuid', nullable: true, })  fusionauth_uuid: string;
  
  // lastupdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  @Column({ type: 'timestamptz' , nullable: false, default: () => "CURRENT_TIMESTAMP"})  lastupdated: Date;
  @Column({ type: 'timestamptz', nullable: false, default: () => "CURRENT_TIMESTAMP"})  created_at: Date;
}
