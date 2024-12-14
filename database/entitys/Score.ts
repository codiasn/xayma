import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from "typeorm";
import { Base } from "./Base";
import { IsInt, Min } from "class-validator";
import { Application } from "./Application";
import { BadRequestException } from "@nestjs/common";

@Entity()
export class Score extends Base {
  @IsInt({ message: "score_score_must_be_int" })
  @Min(1, {
    message: (arg) => `score_score_must_be_greater_than_${arg.constraints}`,
  })
  @Column({ type: "int" })
  score: number;

  @ManyToOne(() => Application, (fyle) => fyle.scores, { nullable: false })
  application: Application;

  @BeforeInsert()
  @BeforeUpdate()
  async _onSave() {
    if (this.score > this.application.max) {
      throw new BadRequestException(
        `score_score_must_be_less_than_${this.application.max}`,
      );
    }
  }
}
