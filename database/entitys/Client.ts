import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Base } from "./Base";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Fyle } from "./Fyle";
import { Application } from "./Application";
import { Profile } from "./Profile";

@Entity()
export class Client extends Base {
  @IsString({ message: "client_name_must_be_string" })
  @MinLength(5, {
    message: (arg) =>
      `client_name_length_must_be_greater_than_${arg.constraints}`,
  })
  @MaxLength(80, {
    message: (arg) => `client_name_length_must_be_less_than_${arg.constraints}`,
  })
  @Column({ type: "varchar" })
  name: string;

  @IsOptional()
  @IsString({ message: "client_description_must_be_string" })
  @Column({ type: "text", nullable: true })
  description?: string;

  @OneToOne(() => Fyle, (fyle) => fyle.logoApplication, { eager: true })
  @JoinColumn()
  logo?: Fyle;

  @OneToMany(() => Application, (application) => application.client)
  applications: Application[];

  @OneToMany(() => Profile, (profile) => profile.client)
  profiles: Profile[];

  @BeforeInsert()
  @BeforeUpdate()
  async saveLogo() {
    if (this.logo) this.logo = await Fyle._create(this.logo);
  }
}
