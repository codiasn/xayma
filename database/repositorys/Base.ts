import {
  DataSource,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { _FindOptions } from "database/entitys/Base";

@Injectable()
export class BaseRepository<T> extends Repository<T> {
  constructor(dataSource: DataSource, entity: EntityTarget<T>) {
    super(entity, dataSource.createEntityManager());
  }

  async _findOne(params: _FindOptions) {
    if (
      Object.values(params)
        .map((v) => v !== undefined)
        .includes(false)
    ) {
      return;
    }

    const datas = await this._find(params);

    return datas[0] as T;
  }

  async _find(params: _FindOptions) {
    const queryBuilder = this.createQueryBuilder(this.metadata.tableName);

    const datas = await queryBuilder.getMany();
    return datas;
  }

  async _joinTable(queryBuilder: SelectQueryBuilder<T>, params: _FindOptions) {
    if (Array.isArray(params._findOptions?.join)) {
      for (const join of params._findOptions.join) {
        if (Array.isArray(join)) {
          queryBuilder.leftJoinAndSelect(join[0], join[1]);
        } else {
          queryBuilder.leftJoinAndSelect(
            `${this.metadata.tableName}.${join}`,
            join,
          );
        }
      }
    }
  }

  async _beforeFind(queryBuilder: SelectQueryBuilder<T>, params: _FindOptions) {
    if (params._findOptions?.beforeFind) {
      params._findOptions.beforeFind(queryBuilder);
    }
  }
}
