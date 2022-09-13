import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stub {
  @PrimaryGeneratedColumn('uuid')  stub_uuid: string;
  @Column({ type: 'uuid', name: 'created_by_uuid', nullable: false, })  created_by_uuid: string;
  @Column({ type: 'boolean', default: false, })  active: boolean;
  
  // lastupdated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  @Column({ type: 'timestamptz', nullable: false, default: () => "CURRENT_TIMESTAMP" })  lastupdated: Date;
  @Column({ type: 'timestamptz', nullable: false , default: () => "CURRENT_TIMESTAMP"})  created_at: Date;
}
