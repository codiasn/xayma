import {
  BaseEntity,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  Column,
  SelectQueryBuilder,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { validate } from "class-validator";

export interface _SaveOptions {
  notSave?: boolean;
}

export interface _FindOptions<T = any> {
  [x: string]: any;
  _findOptions?: {
    beforeFind?: (queryBuilder: SelectQueryBuilder<any>) => void;
    join?: (string | [string, string])[];
  };
}

export class Base extends BaseEntity {
  generateId() {
    this.id = uuidv4();
    return this.id;
  }

  @PrimaryColumn({ type: "uuid", nullable: false })
  id!: string;

  @Column({ type: "timestamp" })
  createdAt: Date;

  @Column({ type: "timestamp" })
  updatedAt: Date;

  @BeforeInsert()
  onInsert() {
    if (!this.id) this.id = uuidv4();

    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async onSave() {
    this.updatedAt = new Date();
    await this._validate();
  }

  async _validate() {
    const errors = await validate(this);
    if (errors.length) {
      throw errors
        .map((error) => Object.values(error.constraints).join(";"))
        .join(";");
    }
  }

  async _save(options: _SaveOptions = {}) {
    if (!options.notSave) await this.save({});
    return this;
  }
}
