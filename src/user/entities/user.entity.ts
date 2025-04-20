import{Entity,PrimaryGeneratedColumn,Column,OneToMany} from 'typeorm';
import{Cv} from '../../cv/entities/cv.entity';
import { TimestampEntity } from "../../common/db/timestamp.entity";
@Entity()
export class User extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  username:string;
  @Column({unique: true})
  email:string;
  @Column()
  password:string;
  @Column({ type: 'varchar', length: 100 })
  salt: string;
  @Column({ type: 'varchar', length: 50 })
  role: string;
  @OneToMany(
    () =>Cv,
    (cv:Cv) => cv.user,
    {eager: true}
  )
  cvs: Cv[];
}
