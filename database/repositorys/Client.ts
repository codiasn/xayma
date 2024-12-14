import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./Base";
import { DataSource } from "typeorm";
import { Client } from "database/entitys/Client";
import { _FindOptions } from "database/entitys/Base";

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(dataSource: DataSource) {
    super(dataSource, Client);
  }

  async _create(data: Partial<Client> & { notSave?: boolean }) {
    let client = new Client();

    if (data.id) {
      client = await this._findOne({ id: data.id });
      if (!client) throw new NotFoundException("client_not_found");
    }

    client.name = data.name || client.name;
    client.logo = data.logo === null ? null : data.logo || client.logo;

    if (!(await client.save())) await client.save();

    return client;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("client");
    queryBuilder.leftJoinAndSelect("client.logo", "logo");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `client.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    const clients = await queryBuilder.getMany();

    return clients;
  }
}
