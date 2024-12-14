import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./Base";
import { DataSource } from "typeorm";
import { Profile } from "database/entitys/Profile";
import { Client } from "database/entitys/Client";
import { _FindOptions, _SaveOptions } from "database/entitys/Base";

@Injectable()
export class ProfileRepository extends BaseRepository<Profile> {
  constructor(dataSource: DataSource) {
    super(dataSource, Profile);
  }

  async _create(data: Partial<Profile>, options?: _SaveOptions) {
    let profile = new Profile();

    if (data.id) {
      profile = await this._findOne({ id: data.id });
      if (!profile) throw new NotFoundException("profile_not_found");
    }

    profile.client = data.client;
    profile.user = data.user;
    profile.profile = data.profile;

    profile = await profile._save(options);

    return profile;
  }

  async _remove(id: string, client: Client) {
    const profile = await this._findOne({ id, client: client.id });
    if (!profile) throw new NotFoundException("profile_not_found");

    await profile.remove();
    return profile;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("profile");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `profile.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.client) {
      params.clients ||= [];
      params.clients.push(params.client);
    }
    if (params.clients) {
      queryBuilder.andWhere(
        `profile.clientId IN (${params.clients.map((client: string) => `'${client}'`).join(",")})`,
      );
    }

    if (params.user) {
      params.users ||= [];
      params.users.push(params.user);
    }
    if (params.users) {
      queryBuilder.andWhere(
        `profile.userId IN (${params.users.map((user: string) => `'${user}'`).join(",")})`,
      );
    }

    const profiles = await queryBuilder.getMany();

    return profiles;
  }
}
