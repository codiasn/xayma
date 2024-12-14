import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { Client } from "./Client";
import { User } from "./User";
import { IsIn } from "class-validator";

@Entity()
export class Profile extends Base {
  @ManyToOne(() => Client, (client) => client.profiles, { nullable: false })
  client: Client;

  @ManyToOne(() => User, (user) => user.profiles, { nullable: false })
  user: User;

  @IsIn(["admin", "agent", "owner"], {
    message: "profile_profile_is_not_acceptable",
  })
  @Column({ type: "varchar", default: "agent" })
  profile: "admin" | "agent" | "owner";
}
