import { Column, Entity, OneToOne } from "typeorm";
import { Base } from "./Base";
import { IsInt, IsString } from "class-validator";
import { Application } from "./Application";

@Entity()
export class Fyle extends Base {
  @IsString({ message: "fyle_name_must_be_string" })
  @Column({ type: "varchar" })
  name: string;

  @IsString({ message: "fyle_type_must_be_string" })
  @Column({ type: "varchar" })
  type: string;

  @IsInt({ message: "fyle_size_must_be_int" })
  @Column({ type: "int" })
  size: number;

  @IsString({ message: "fyle_content_must_be_string" })
  @Column({ type: "text" })
  content: number;

  @OneToOne(() => Application, (application) => application.logo)
  logoApplication: Application;

  static async _create(data: Fyle) {
    const fyle = new Fyle();
    fyle.id = data.id;
    fyle.name = data.name;
    fyle.size = data.size;
    fyle.type = data.type;
    fyle.content = data.content;

    await fyle.save();

    return fyle;
  }
}
