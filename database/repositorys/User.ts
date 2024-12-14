import { User } from "database/entitys/User";
import { DataSource } from "typeorm";
import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import jwt, { verify } from "utils/jwt";
import { BaseRepository } from "./Base";
import forge from "utils/forge";
import { _FindOptions, _SaveOptions } from "database/entitys/Base";

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);
  }

  static comparePassword(password: string | string[], givenPassword: string) {
    const _password = forge.decrypter(password);
    return _password === givenPassword;
  }

  async _create(
    params: Partial<User> & { password?: string; notSave?: boolean },
    options?: _SaveOptions,
  ) {
    let user = new User();

    if (params.id) {
      user = await this._findOne({ id: params.id });
      if (!user) throw new NotFoundException("user_not_found");
    } else {
      // vérifier qu'un user de même adresse email n'existe pas déjà
      if (await this._findOne({ email: params.email })) {
        throw new NotAcceptableException("user_with_email_already_registered");
      }

      user.email = params.email;
    }

    user.firstName = params.firstName || user.firstName;
    user.lastName = params.lastName || user.lastName;
    user.password = params.password || user.password;

    if (!params.notSave) await user._save(options);

    return user;
  }

  async _confirmIdentity(token: string) {
    const id = verify(token) as { id: string };

    const user = await this._findOne(id);
    if (!user) throw new ForbiddenException("not_authorized");

    if (user.confirmedIdentity) {
      throw new ForbiddenException("user_already_confirmed");
    }

    user.confirmedIdentity = true;

    await user.save();

    return user;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("user");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `user.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.email) {
      params.emails ||= [];
      params.emails.push(params.email);
    }
    if (params.emails) {
      queryBuilder.andWhere(
        `user.email IN (${params.emails.map((email: string) => `'${email}'`).join(",")})`,
      );
    }

    const users = await queryBuilder.getMany();

    return users;
  }
}
