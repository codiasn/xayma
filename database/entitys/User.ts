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
import { Session } from "./Session";
import { IsEmail, IsString } from "class-validator";
import { BadRequestException } from "@nestjs/common";
import forge from "utils/forge";
import { Profile } from "./Profile";

export const regexPaswword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~\-])[A-Za-z\d!@#$%^&*()_+\[\]{};':"\\|,.<>/?`~\-]{8,}$/;

@Entity()
export class User extends Base {
  @IsEmail({}, { message: "user_email_is_not_valid" })
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  @IsString({ message: "user_firstName_must_be_string" })
  firstName: string;

  @Column({ type: "varchar" })
  @IsString({ message: "user_lastName_must_be_string" })
  lastName: string;

  @Column({ type: "json", nullable: true })
  password: { value: string | string[] };

  @Column({ type: "boolean", default: false })
  confirmedIdentity: boolean;

  @OneToMany(() => Session, (photo) => photo.user)
  sessions: Session[];

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles: Profile[];

  @BeforeInsert()
  @BeforeUpdate()
  async _onSave() {
    const password = this.password as any as string;

    if (typeof password === "string") {
      if (!regexPaswword.test(password)) {
        throw new BadRequestException("user_password_not_valid");
      }

      const pwd = forge.encrypter(password);
      this.password = { value: pwd };
    }
  }
}
