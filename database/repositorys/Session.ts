import { Session } from "database/entitys/Session";
import { DataSource } from "typeorm";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./Base";
import { UserRepository } from "./User";
import { User } from "database/entitys/User";
import { ClientRepository } from "./Client";
import { sendMail } from "utils/mailer";
import jwt from "utils/jwt";
import { ProfileRepository } from "./Profile";
import { _FindOptions } from "database/entitys/Base";

@Injectable()
export class SessionRepository extends BaseRepository<Session> {
  constructor(dataSource: DataSource) {
    super(dataSource, Session);
  }

  @Inject() userRepository: UserRepository;
  @Inject() clientRepository: ClientRepository;
  @Inject() profileRepository: ProfileRepository;

  async _add(publicKey: string) {
    const session = new Session();
    session.publicKey = publicKey;

    await session.save();

    return session;
  }

  async _register(data: Partial<User> & { password: string }) {
    const user = await this.userRepository._create({
      ...data,
      notSave: true,
    });
    await user._validate();

    const client = await this.clientRepository._create({
      name: `${user.firstName}'s organization`,
      notSave: true,
    });

    await user.save();
    await client.save();
    await this.profileRepository._create({ user, client, profile: "owner" });

    // await sendMail({
    //   text: `${process.env.API_URL}/user/confirmation/${jwt.sign(user.id)}`,
    //   to: user.email,
    //   subject: "Account confirmation",
    // });

    return {};
  }

  async _findOne(params: { [x: string]: any }) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const sessions = await this._find(params);

    return sessions[0];
  }

  async _update(id: string, params: Partial<Session> = {}) {
    const session = await this._findOne({ id });
    if (!session) throw new NotFoundException("session_not_found");

    session.user = params.user || session.user;
    session.closed = params.closed || session.closed;

    await session.save();

    return session;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("session");
    queryBuilder.leftJoinAndSelect("session.user", "user");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `session.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    const sessions = await queryBuilder.getMany();

    return sessions;
  }
}
