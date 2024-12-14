import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Base } from "./Base";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { Fyle } from "./Fyle";
import { Score } from "./Score";
import { Client } from "./Client";

/**
 * Une application est
 */
@Entity()
export class Application extends Base {
  @IsString({ message: "app_name_must_be_string" })
  @MinLength(5, {
    message: (arg) => `app_name_length_must_be_greater_than_${arg.constraints}`,
  })
  @MaxLength(80, {
    message: (arg) => `app_name_length_must_be_less_than_${arg.constraints}`,
  })
  @Column({ type: "varchar" })
  name: string;

  @IsOptional()
  @IsString({ message: "app_description_must_be_string" })
  @Column({ type: "text", nullable: true })
  description?: string;

  /**
   * @default false
   * si défini à true, l'application ne pourra recevoir qu'un seul score
   * */
  @IsOptional()
  @IsBoolean({ message: "app_once_must_be_boolean" })
  @Column({ type: "boolean", default: false })
  once: boolean;

  /** @default false */
  @IsOptional()
  @IsBoolean({ message: "app_close_must_be_boolean" })
  @Column({ type: "boolean", default: false })
  close: boolean;

  /**
   * @default 5
   * La note maximale que l'application peut prendre
   */
  @IsOptional()
  @IsInt({ message: "app_max_must_be_int" })
  @Min(2, {
    message: (arg) => `app_max_must_be_greater_than_${arg.constraints}`,
  })
  @Max(10, { message: (arg) => `app_max_must_be_less_than_${arg.constraints}` })
  @Column({ type: "int", default: 5 })
  max: number;

  @OneToOne(() => Fyle, (fyle) => fyle.logoApplication, { eager: true })
  @JoinColumn()
  logo?: Fyle;

  /** Message à afficher après soummission de la note */
  @Column({ type: "json", default: {} })
  message: {
    /**
     * _ pour tous les langue
     * fr pour farançais
     * en pour anglais
     * ...
     */
    [x: string]: string;
  };

  @OneToMany(() => Score, (score) => score.application)
  scores: Score[];

  @ManyToOne(() => Client, (client) => client.applications, { nullable: false })
  client: Client;

  @BeforeInsert()
  @BeforeUpdate()
  async saveLogo() {
    if (this.logo) this.logo = await Fyle._create(this.logo);
  }
}
