import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseRepository } from "./Base";
import { DataSource } from "typeorm";
import { Application } from "database/entitys/Application";
import { Client } from "database/entitys/Client";
import { _FindOptions } from "database/entitys/Base";

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor(dataSource: DataSource) {
    super(dataSource, Application);
  }

  async _create(data: Partial<Application>, client: Client) {
    let application = new Application();

    if (data.id) {
      application = await this._findOne({ id: data.id, client: client.id });
      if (!application) throw new NotFoundException("application_not_found");
    }

    application.client = client;
    application.name = data.name || application.name;
    application.steps = data.steps || application.steps;
    application.component = data.component || application.component;
    application.description = data.description || application.description;
    application.max = data.max || application.max;
    application.logo = data.logo || application.logo;
    application.message = data.message || application.message;

    application.once =
      typeof data.once === "boolean" ? data.once : application.once;

    await application.save();
    return application;
  }

  async _remove(id: string, client: Client) {
    const application = await this._findOne({ id, client: client.id });
    if (!application) throw new NotFoundException("application_not_found");

    await application.remove();
    return application;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("application");
    queryBuilder.leftJoinAndSelect("application.logo", "logo");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `application.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.client) {
      params.clients ||= [];
      params.clients.push(params.client);
    }
    if (params.clients) {
      queryBuilder.andWhere(
        `application.clientId IN (${params.clients.map((client: string) => `'${client}'`).join(",")})`,
      );
    }

    const applications = await queryBuilder.getMany();

    return applications;
  }
}
