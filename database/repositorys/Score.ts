import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { BaseRepository } from "./Base";
import { DataSource } from "typeorm";
import { Score } from "database/entitys/Score";
import { Application } from "database/entitys/Application";
import { _FindOptions } from "database/entitys/Base";

@Injectable()
export class ScoreRepository extends BaseRepository<Score> {
  constructor(dataSource: DataSource) {
    super(dataSource, Score);
  }

  async _add(data: { score: number }, application: Application) {
    const score = new Score();

    // si once est défini, vérifie qu'il n'y a pas un score
    if (application.once) {
      if (await this._findOne({ application: application.id })) {
        throw new UnauthorizedException("not_authorized_action");
      }
    }

    if (application.close) {
      if (await this._findOne({ application: application.id })) {
        throw new UnauthorizedException("not_authorized_action");
      }
    }

    score.score = data.score;
    score.application = application;

    await score.save();
    return score;
  }

  async _find(params: _FindOptions = {}) {
    const queryBuilder = this.createQueryBuilder("score");
    queryBuilder.leftJoinAndSelect("score.application", "application");

    this._joinTable(queryBuilder, params);

    if (params.id) {
      params.ids ||= [];
      params.ids.push(params.id);
    }
    if (params.ids) {
      queryBuilder.andWhere(
        `score.id IN (${params.ids.map((id: string) => `'${id}'`).join(",")})`,
      );
    }

    if (params.application) {
      params.applications ||= [];
      params.applications.push(params.application);
    }
    if (params.applications) {
      queryBuilder.andWhere(
        `score.applicationId IN (${params.applications.map((application: string) => `'${application}'`).join(",")})`,
      );
    }

    const scores = await queryBuilder.getMany();

    return scores;
  }
}
